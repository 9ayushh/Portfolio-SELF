package com.ayushraj.portfolio;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

// If using older tomcat replace jakarta with javax
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Advanced Contact Form Backend
 * This servlet handles POST requests from the portfolio contact form,
 * validates data, and inserts it into a MySQL Database.
 */
@WebServlet("/submit-contact")
public class ContactServlet extends HttpServlet {
    
    // Database credentials
    private static final String DB_URL = "jdbc:mysql://localhost:3306/portfolio_db";
    private static final String DB_USER = "root"; // Update as needed
    private static final String DB_PASS = "password"; // Update as needed

    @Override
    public void init() throws ServletException {
        try {
            // Explicitly load the MySQL driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ServletException("MySQL Driver not found.", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Setup response type for JSON (if using Fetch API) or plain text
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        // 1. Retrieve & Sanitize Inputs
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String message = request.getParameter("message");
        
        if(name == null || email == null || message == null ||
           name.trim().isEmpty() || email.trim().isEmpty() || message.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\", \"message\":\"All fields are required.\"}");
            out.flush();
            return;
        }

        // 2. Insert into MySQL Database
        String insertQuery = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
             PreparedStatement pstmt = conn.prepareStatement(insertQuery)) {
            
            pstmt.setString(1, name.trim());
            pstmt.setString(2, email.trim());
            pstmt.setString(3, message.trim());
            
            int rowsAffected = pstmt.executeUpdate();
            
            if(rowsAffected > 0) {
                response.setStatus(HttpServletResponse.SC_OK);
                out.print("{\"status\":\"success\", \"message\":\"Your message was received successfully.\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"status\":\"error\", \"message\":\"Failed to save message to database.\"}");
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\":\"error\", \"message\":\"Database connectivity error.\"}");
        }
        
        out.flush();
    }
}
