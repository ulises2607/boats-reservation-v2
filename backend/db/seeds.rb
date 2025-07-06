# Limpiar la base de datos
puts "🧹 Limpiando la base de datos..."
Reservation.destroy_all
Boat.destroy_all
User.destroy_all

puts "👥 Creando usuarios..."

# Crear admin
admin = User.create!(
  name: "Admin Boats",
  email: "admin@gmail.com",
  password: "asdqwe123",
  password_confirmation: "asdqwe123",
  role: "admin"
)
puts "✅ Admin creado: #{admin.email}"

# Crear owners (propietarios de botes)
owners = []
10.times do |i|
  owner = User.create!(
    name: "owner#{i + 1}",
    email: "owner#{i + 1}@gmail.com",
    password: "asdqwe123",
    password_confirmation: "asdqwe123",
    role: "owner"
  )
  owners << owner
  puts "✅ Owner creado: #{owner.email}"
end

# Crear renters (inquilinos)
renters = []
10.times do |i|
  renter = User.create!(
    name: "renter#{i + 1}",
    email: "renter#{i + 1}@gmail.com",
    password: "asdqwe123",
    password_confirmation: "asdqwe123",
    role: "renter"
  )
  renters << renter
  puts "✅ Renter creado: #{renter.email}"
end

puts "🚤 Creando botes..."

# Datos de botes con imágenes existentes
boats_data = [
  {
    name: "Ocean Explorer",
    description: "Luxury yacht perfect for ocean adventures and sunset cruises",
    color: "White",
    rent_price: 150,
    price: 85000,
    location: "Miami Marina",
    capacity: 8,
    boat_type: "yacht",
    picture: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Speed Demon",
    description: "High-speed motorboat for thrill seekers and water sports",
    color: "Red",
    rent_price: 120,
    price: 65000,
    location: "Key West Harbor",
    capacity: 6,
    boat_type: "speedboat",
    picture: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Peaceful Sailor",
    description: "Classic sailboat for relaxing trips and learning to sail",
    color: "Blue",
    rent_price: 90,
    price: 45000,
    location: "San Diego Bay",
    capacity: 4,
    boat_type: "sailboat",
    picture: "https://images.unsplash.com/photo-1570987821324-0ec58389e52a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Family Fun",
    description: "Perfect motorboat for family gatherings and lake activities",
    color: "Green",
    rent_price: 80,
    price: 35000,
    location: "Lake Tahoe",
    capacity: 10,
    boat_type: "motorboat",
    picture: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Fishing Master",
    description: "Specialized fishing boat with all the equipment you need",
    color: "Gray",
    rent_price: 110,
    price: 55000,
    location: "Gulf Shores",
    capacity: 6,
    boat_type: "fishing_boat",
    picture: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Sunset Cruiser",
    description: "Elegant catamaran ideal for romantic sunset cruises",
    color: "White",
    rent_price: 180,
    price: 125000,
    location: "Honolulu Harbor",
    capacity: 12,
    boat_type: "catamaran",
    picture: "https://images.unsplash.com/photo-1541986655784-7eb8d5c8f47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Adventure Seeker",
    description: "Rugged motorboat built for adventure and exploration",
    color: "Black",
    rent_price: 140,
    price: 75000,
    location: "Seattle Marina",
    capacity: 8,
    boat_type: "yacht",
    picture: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Wave Rider",
    description: "Sporty speedboat for water skiing and wakeboarding",
    color: "Yellow",
    rent_price: 100,
    price: 40000,
    location: "Lake Powell",
    capacity: 6,
    boat_type: "speedboat",
    picture: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Classic Beauty",
    description: "Vintage sailboat with timeless elegance and charm",
    color: "Brown",
    rent_price: 130,
    price: 90000,
    location: "Newport Beach",
    capacity: 6,
    boat_type: "sailboat",
    picture: "https://images.unsplash.com/photo-1572890800259-9b3e1dd3de86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Party Barge",
    description: "Large motorboat perfect for celebrations and group events",
    color: "Purple",
    rent_price: 200,
    price: 110000,
    location: "Fort Lauderdale",
    capacity: 20,
    boat_type: "motorboat",
    picture: "https://images.unsplash.com/photo-1588059191438-67522d4fb2b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
]

# Crear botes asignándolos a owners
boats_data.each_with_index do |boat_data, index|
  owner = owners[index] # Asignar cada bote a un owner diferente
  
  boat = Boat.create!(
    name: boat_data[:name],
    description: boat_data[:description],
    color: boat_data[:color],
    rent_price: boat_data[:rent_price],
    price: boat_data[:price],
    location: boat_data[:location],
    capacity: boat_data[:capacity],
    boat_type: boat_data[:boat_type],
    picture: boat_data[:picture],
    user: owner
  )
  
  puts "✅ Bote creado: #{boat.name} (Owner: #{owner.name})"
end

puts "📊 Creando algunas reservas de ejemplo..."

# Crear algunas reservas de ejemplo
3.times do |i|
  boat = Boat.limit(5).offset(i).first
  renter = renters[i]
  
  # Crear reserva pendiente
  reservation = Reservation.create!(
    user: renter,
    boat: boat,
    start_date: Date.current + (i + 1).weeks,
    end_date: Date.current + (i + 1).weeks + 3.days,
    notes: "Reserva de ejemplo #{i + 1}",
    status: 'pending'
  )
  
  puts "✅ Reserva creada: #{renter.name} reservó #{boat.name} (#{reservation.status})"
end

# Crear una reserva confirmada
confirmed_boat = Boat.limit(1).offset(5).first
confirmed_renter = renters[3]

confirmed_reservation = Reservation.create!(
  user: confirmed_renter,
  boat: confirmed_boat,
  start_date: Date.current + 2.weeks,
  end_date: Date.current + 2.weeks + 5.days,
  notes: "Reserva confirmada de ejemplo",
  status: 'confirmed'
)

puts "✅ Reserva confirmada creada: #{confirmed_renter.name} reservó #{confirmed_boat.name}"

puts "\n🎉 ¡Base de datos poblada exitosamente!"
puts "\n📈 Estadísticas:"
puts "👥 Usuarios creados: #{User.count}"
puts "   - Admins: #{User.admin.count}"
puts "   - Owners: #{User.owner.count}"
puts "   - Renters: #{User.renter.count}"
puts "🚤 Botes creados: #{Boat.count}"
puts "📋 Reservas creadas: #{Reservation.count}"
puts "\n🔑 Credenciales de acceso:"
puts "Admin: admin@gmail.com / asdqwe123"
puts "Owners: owner1@gmail.com - owner10@gmail.com / asdqwe123"
puts "Renters: renter1@gmail.com - renter10@gmail.com / asdqwe123"

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