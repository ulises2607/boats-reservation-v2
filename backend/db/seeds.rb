# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
['Felipe', 'Ulises', 'Hajnal'].each do |name|
  email = "#{name.downcase}@example.com"
  # Usamos find_or_create_by! con el email para evitar duplicados y asegurar unicidad
  User.find_or_create_by!(email: email) do |user|
    user.name = name # Asigna el nombre si es un nuevo registro
    user.password = 'password123' # Contraseña por defecto
    user.password_confirmation = 'password123' # Confirmación de contraseña
    # Si tienes otras validaciones o campos obligatorios en User, añádelos aquí.
  end
  puts "Created/Found user: #{name} with email: #{email}"
end

# Asegúrate de que los botes tengan un usuario existente
# Es mejor usar find_by(email: '...') para que coincida con la creación de usuarios
[
  { name: 'Fishing Boat', description: 'Fishing boats are used on saltwater and freshwater bodies and come in various sizes.', price: 8000, color: 'Red', rent_price: 100, user: User.find_by(email: 'felipe@example.com'), picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/Fishing-Boat.jpg' },
  { name: 'Yacht', description: 'A yacht is a type of boat that epitomizes fun and luxury, which has been developed for recreational use and is essentially a fancy motorboat.', price: 250000, color: 'White', rent_price: 1000, user: User.find_by(email: 'hajnal@example.com'), picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/yacht.jpg' },
  { name: 'Deck Boat', description: 'As the name suggests, a boat with ample od deck space is called a Deck boat.', price: 20000, color: 'White', rent_price: 250, user: User.find_by(email: 'ulises@example.com'), picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/Deck-boat.jpg' },
  { name: 'Houseboat', description: 'A boat designed or modified to be used primarily as a home is called a houseboat.', price: 70000, color: 'Red', rent_price: 400, user: User.find_by(email: 'hajnal@example.com'), picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/houseboats.jpg' },
  { name: 'Sail Boat', description: 'For as long as there were sailors, there were sailboats with variations in design from time to time.', price: 90000, color: 'Grey', rent_price: 500, user: User.find_by(email: 'felipe@example.com'), picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/Sail-boats.jpg' },
  { name: 'Pontoon', description: 'Pontoon is a luxurious pleasure boat that acquired a significant appeal from being an unsightly boxy watercraft.', price: 70000, color: 'Blue', rent_price: 300, user: User.find_by(email: 'ulises@example.com'), picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/Pontoon.jpg' },
].each do |boat_attributes|
  Boat.find_or_create_by!(boat_attributes)
  puts "Created/Found boat: #{boat_attributes[:name]}"
end