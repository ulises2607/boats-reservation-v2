#!/usr/bin/env ruby

# Add the current directory to the load path
$LOAD_PATH.unshift(File.expand_path('.'))

# Load Rails environment
require_relative 'backend/config/environment'

puts "=== CHECKING USERS ==="
puts "Total users: #{User.count}"
puts ""

if User.count > 0
  puts "Existing users:"
  User.all.each do |user|
    puts "- Email: #{user.email}, Name: #{user.name}, Role: #{user.role}"
  end
else
  puts "No users found. Creating a test user..."
  
  user = User.create!(
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    password_confirmation: "password123",
    role: "renter"
  )
  
  puts "Created user: #{user.email}"
end

puts ""
puts "=== CHECKING BOATS ==="
puts "Total boats: #{Boat.count}"
