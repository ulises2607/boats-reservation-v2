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
boats_data = [
  { 
    name: 'Fishing Boat', 
    description: 'Professional fishing boat equipped with the latest sonar and fishing equipment. Perfect for deep sea fishing adventures.',
    price: 8000, 
    color: 'Red', 
    rent_price: 100, 
    user: User.find_by(email: 'felipe@example.com'), 
    picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/Fishing-Boat.jpg',
    boat_type: 'fishing',
    capacity: 6,
    location: 'Marina del Rey, CA',
    amenities: ['GPS', 'Fish Finder', 'Rod Holders', 'Ice Box', 'First Aid Kit'],
    images: [
      'https://stylesatlife.com/wp-content/uploads/2022/07/Fishing-Boat.jpg',
      'https://example.com/fishing-boat-2.jpg'
    ],
    rating: 4.5,
    available: true
  },
  { 
    name: 'Luxury Yacht', 
    description: 'Stunning luxury yacht with premium amenities. Experience the ultimate in comfort and style on the water.',
    price: 250000, 
    color: 'White', 
    rent_price: 1000, 
    user: User.find_by(email: 'hajnal@example.com'), 
    picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/yacht.jpg',
    boat_type: 'yacht',
    capacity: 12,
    location: 'Newport Beach, CA',
    amenities: ['Air Conditioning', 'Full Kitchen', 'Master Suite', 'Hot Tub', 'Entertainment System', 'Jet Ski'],
    images: [
      'https://stylesatlife.com/wp-content/uploads/2022/07/yacht.jpg',
      'https://example.com/yacht-2.jpg',
      'https://example.com/yacht-3.jpg'
    ],
    rating: 4.9,
    available: true
  },
  { 
    name: 'Family Deck Boat', 
    description: 'Spacious deck boat perfect for family outings. Plenty of room for relaxation and water activities.',
    price: 20000, 
    color: 'White', 
    rent_price: 250, 
    user: User.find_by(email: 'ulises@example.com'), 
    picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/Deck-boat.jpg',
    boat_type: 'deck',
    capacity: 8,
    location: 'Lake Tahoe, CA',
    amenities: ['Swim Platform', 'Cooler', 'Sun Shade', 'Bluetooth Audio', 'Safety Equipment'],
    images: [
      'https://stylesatlife.com/wp-content/uploads/2022/07/Deck-boat.jpg',
      'https://example.com/deck-boat-2.jpg'
    ],
    rating: 4.3,
    available: true
  },
  { 
    name: 'Floating Houseboat', 
    description: 'Unique floating home experience. Stay overnight on the water with all the comforts of home.',
    price: 70000, 
    color: 'Red', 
    rent_price: 400, 
    user: User.find_by(email: 'hajnal@example.com'), 
    picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/houseboats.jpg',
    boat_type: 'houseboat',
    capacity: 4,
    location: 'Sausalito, CA',
    amenities: ['Full Kitchen', 'Bedroom', 'Bathroom', 'Living Area', 'Deck', 'WiFi'],
    images: [
      'https://stylesatlife.com/wp-content/uploads/2022/07/houseboats.jpg',
      'https://example.com/houseboat-2.jpg'
    ],
    rating: 4.7,
    available: true
  },
  { 
    name: 'Classic Sailboat', 
    description: 'Beautiful classic sailboat for the ultimate sailing experience. Feel the wind in your hair and enjoy the peace of sailing.',
    price: 90000, 
    color: 'Grey', 
    rent_price: 500, 
    user: User.find_by(email: 'felipe@example.com'), 
    picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/Sail-boats.jpg',
    boat_type: 'sailboat',
    capacity: 6,
    location: 'San Diego, CA',
    amenities: ['Full Sail Set', 'Navigation Equipment', 'Safety Gear', 'Small Galley', 'Sleeping Quarters'],
    images: [
      'https://stylesatlife.com/wp-content/uploads/2022/07/Sail-boats.jpg',
      'https://example.com/sailboat-2.jpg'
    ],
    rating: 4.6,
    available: true
  },
  { 
    name: 'Party Pontoon', 
    description: 'Fun pontoon boat perfect for parties and group gatherings. Great for celebrating on the water.',
    price: 70000, 
    color: 'Blue', 
    rent_price: 300, 
    user: User.find_by(email: 'ulises@example.com'), 
    picture: 'https://stylesatlife.com/wp-content/uploads/2022/07/Pontoon.jpg',
    boat_type: 'pontoon',
    capacity: 10,
    location: 'Lake Havasu, AZ',
    amenities: ['Sound System', 'Grill', 'Coolers', 'Slide', 'Canopy', 'LED Lights'],
    images: [
      'https://stylesatlife.com/wp-content/uploads/2022/07/Pontoon.jpg',
      'https://example.com/pontoon-2.jpg'
    ],
    rating: 4.4,
    available: true
  },
  {
    name: 'Sport Speedboat',
    description: 'High-performance speedboat for thrill seekers. Perfect for water sports and adrenaline-filled adventures.',
    price: 45000,
    color: 'Black',
    rent_price: 200,
    user: User.find_by(email: 'felipe@example.com'),
    picture: 'https://example.com/speedboat.jpg',
    boat_type: 'speedboat',
    capacity: 4,
    location: 'Miami Beach, FL',
    amenities: ['Wakeboard Tower', 'High-Performance Engine', 'Water Ski Equipment', 'Sound System', 'GPS'],
    images: [
      'https://example.com/speedboat.jpg',
      'https://example.com/speedboat-2.jpg'
    ],
    rating: 4.8,
    available: true
  },
  {
    name: 'Catamaran Paradise',
    description: 'Spacious twin-hull catamaran offering stability and comfort. Perfect for multi-day sailing adventures.',
    price: 180000,
    color: 'White',
    rent_price: 800,
    user: User.find_by(email: 'hajnal@example.com'),
    picture: 'https://example.com/catamaran.jpg',
    boat_type: 'catamaran',
    capacity: 8,
    location: 'Key West, FL',
    amenities: ['Multiple Cabins', 'Full Kitchen', 'Navigation Suite', 'Snorkel Gear', 'Fishing Equipment', 'Solar Panels'],
    images: [
      'https://example.com/catamaran.jpg',
      'https://example.com/catamaran-2.jpg',
      'https://example.com/catamaran-3.jpg'
    ],
    rating: 4.7,
    available: true
  }
]

boats_data.each do |boat_attributes|
  # Usar find_or_create_by solo con el nombre para evitar duplicados
  boat = Boat.find_or_create_by(name: boat_attributes[:name]) do |b|
    boat_attributes.each do |key, value|
      b.send("#{key}=", value) if b.respond_to?("#{key}=")
    end
  end
  puts "Created/Found boat: #{boat.name}"
end