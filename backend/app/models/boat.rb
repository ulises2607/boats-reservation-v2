class Boat < ApplicationRecord
  belongs_to :user
  has_many :reservations, dependent: :destroy

  # Validaciones existentes
  validates :name, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :color, presence: true
  validates :rent_price, presence: true, numericality: { greater_than: 0 }
  validates :user_id, presence: true

  # Nuevas validaciones
  validates :boat_type, presence: true, inclusion: { 
    in: %w[motorboat sailboat yacht fishing_boat speedboat catamaran],
    message: "%{value} is not a valid boat type" 
  }
  validates :capacity, presence: true, numericality: { 
    greater_than: 0, less_than_or_equal_to: 50 
  }
  validates :length, numericality: { greater_than: 0 }, allow_nil: true
  validates :minimum_rental_hours, numericality: { 
    greater_than: 0, less_than_or_equal_to: 24 
  }
  validates :hourly_rate, numericality: { greater_than: 0 }, allow_nil: true
  validates :daily_rate, numericality: { greater_than: 0 }, allow_nil: true
  validates :rating_average, numericality: { 
    greater_than_or_equal_to: 0, less_than_or_equal_to: 5 
  }
  validates :total_reviews, numericality: { greater_than_or_equal_to: 0 }
  validates :latitude, numericality: { 
    greater_than_or_equal_to: -90, less_than_or_equal_to: 90 
  }, allow_nil: true
  validates :longitude, numericality: { 
    greater_than_or_equal_to: -180, less_than_or_equal_to: 180 
  }, allow_nil: true

  # Scopes para búsquedas
  scope :available, -> { where(availability_status: true) }
  scope :by_type, ->(type) { where(boat_type: type) }
  scope :by_capacity, ->(min_capacity) { where('capacity >= ?', min_capacity) }
  scope :by_location, ->(location) { where('location ILIKE ?', "%#{location}%") }
  scope :near_coordinates, ->(lat, lng, radius = 50) {
    where(
      "SQRT(POW(69.1 * (latitude - ?), 2) + POW(69.1 * (? - longitude) * COS(latitude / 57.3), 2)) < ?",
      lat, lng, radius
    )
  }
  scope :top_rated, -> { where('rating_average >= ?', 4.0) }
  scope :price_range, ->(min_price, max_price) { 
    where(daily_rate: min_price..max_price) 
  }

  # Métodos de instancia
  def amenities_list
    return [] if amenities.blank?
    JSON.parse(amenities)
  rescue JSON::ParserError
    []
  end

  def amenities_list=(list)
    self.amenities = list.to_json
  end

  def images_list
    return [] if images.blank?
    JSON.parse(images)
  rescue JSON::ParserError
    []
  end

  def images_list=(list)
    self.images = list.to_json
  end

  def primary_image
    images_list.first || '/default-boat.jpg'
  end

  def boat_type_display
    boat_type.humanize
  end

  def capacity_text
    "#{capacity} #{'person'.pluralize(capacity)}"
  end

  def length_text
    return 'Length not specified' if length.blank?
    "#{length}m"
  end

  def location_display
    location.presence || 'Location not specified'
  end

  def has_coordinates?
    latitude.present? && longitude.present?
  end

  def rating_stars
    return '☆☆☆☆☆' if rating_average == 0.0
    '★' * rating_average.round + '☆' * (5 - rating_average.round)
  end

  def price_per_hour
    hourly_rate.presence || (daily_rate.present? ? daily_rate / 8 : rent_price)
  end

  def price_per_day
    daily_rate.presence || (hourly_rate.present? ? hourly_rate * 8 : rent_price)
  end

  def available?
    availability_status
  end

  def toggle_availability!
    update!(availability_status: !availability_status)
  end
end
