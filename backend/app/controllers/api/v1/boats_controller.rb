class Api::V1::BoatsController < ApplicationController
  skip_before_action :authenticate_request, only: [:index, :show]
  
  # GET /api/v1/boats
  def index
    boats = Boat.available.includes(:user)
    
    # Aplicar filtros si existen
    boats = apply_filters(boats)
    
    # Aplicar ordenamiento
    boats = apply_sorting(boats)
    
    # Paginación (opcional)
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 20
    per_page = [per_page, 50].min # Máximo 50 por página
    
    boats = boats.offset((page - 1) * per_page).limit(per_page)
    
    render json: { 
      status: 'success', 
      data: boats.as_json(boat_json_options),
      pagination: {
        page: page,
        per_page: per_page,
        total: Boat.available.count
      }
    }, status: :ok
  rescue StandardError => e
    render json: { status: 'error', message: e.message }, status: :internal_server_error
  end

  # GET /api/v1/boats/search
  def search
    query = params[:q]
    location = params[:location]
    
    boats = Boat.available
    
    if query.present?
      boats = boats.where(
        "name ILIKE ? OR description ILIKE ? OR location ILIKE ?", 
        "%#{query}%", "%#{query}%", "%#{query}%"
      )
    end
    
    if location.present?
      boats = boats.by_location(location)
    end
    
    boats = apply_filters(boats)
    boats = apply_sorting(boats)
    
    render json: { 
      status: 'success', 
      data: boats.limit(20).as_json(boat_json_options)
    }, status: :ok
  rescue StandardError => e
    render json: { status: 'error', message: e.message }, status: :internal_server_error
  end

  # GET /api/v1/boats/near
  def near
    latitude = params[:lat]&.to_f
    longitude = params[:lng]&.to_f
    radius = params[:radius]&.to_f || 50
    
    if latitude.blank? || longitude.blank?
      return render json: { 
        status: 'error', 
        message: 'Latitude and longitude are required' 
      }, status: :bad_request
    end
    
    boats = Boat.available.near_coordinates(latitude, longitude, radius)
    boats = apply_filters(boats)
    boats = apply_sorting(boats)
    
    render json: { 
      status: 'success', 
      data: boats.limit(20).as_json(boat_json_options)
    }, status: :ok
  rescue StandardError => e
    render json: { status: 'error', message: e.message }, status: :internal_server_error
  end

  # GET /api/v1/boats/:id
  def show
    boat = Boat.find(params[:id])
    render json: { 
      status: 'success', 
      data: boat.as_json(boat_detail_json_options)
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { status: 'error', message: 'Boat not found' }, status: :not_found
  rescue StandardError => e
    render json: { status: 'error', message: e.message }, status: :internal_server_error
  end

  # DELETE /api/v1/boats/:id
  def destroy
    boat = Boat.find(params[:id])
    boat.destroy!
    render json: { message: 'Boat successfully destroyed' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Boat not found' }, status: :not_found
  rescue ActiveRecord::RecordNotDestroyed => e
    render json: { error: "Failed to destroy boat: #{e.message}" }, status: :unprocessable_entity
  end

  # POST /api/v1/boats
  def create
    boat = Boat.new(boat_params)
    if boat.save
      render json: { 
        status: 'success', 
        data: boat.as_json(boat_detail_json_options)
      }, status: :created
    else
      render json: { 
        status: 'error', 
        message: boat.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/boats/:id
  def update
    boat = Boat.find(params[:id])
    if boat.update(boat_params)
      render json: { 
        status: 'success', 
        data: boat.as_json(boat_detail_json_options)
      }, status: :ok
    else
      render json: { 
        status: 'error', 
        message: boat.errors.full_messages 
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { status: 'error', message: 'Boat not found' }, status: :not_found
  end

  private

  def boat_params
    params.require(:boat).permit(
      :name, :description, :price, :color, :rent_price, :user_id, :picture,
      :boat_type, :capacity, :length, :location, :latitude, :longitude,
      :minimum_rental_hours, :hourly_rate, :daily_rate, :availability_status,
      amenities: [], images: []
    )
  end

  def apply_filters(boats)
    boats = boats.by_type(params[:boat_type]) if params[:boat_type].present?
    boats = boats.by_capacity(params[:min_capacity]) if params[:min_capacity].present?
    boats = boats.top_rated if params[:top_rated] == 'true'
    
    if params[:min_price].present? && params[:max_price].present?
      boats = boats.price_range(params[:min_price], params[:max_price])
    end
    
    boats
  end

  def apply_sorting(boats)
    case params[:sort_by]
    when 'price_low'
      boats.order(:daily_rate, :rent_price)
    when 'price_high'
      boats.order(daily_rate: :desc, rent_price: :desc)
    when 'rating'
      boats.order(rating_average: :desc, total_reviews: :desc)
    when 'newest'
      boats.order(created_at: :desc)
    else
      boats.order(:name)
    end
  end

  def boat_json_options
    {
      include: {
        user: { only: [:id, :name] }
      },
      methods: [
        :boat_type_display, :capacity_text, :length_text, 
        :location_display, :primary_image, :rating_stars,
        :price_per_hour, :price_per_day, :amenities_list
      ]
    }
  end

  def boat_detail_json_options
    {
      include: {
        user: { only: [:id, :name, :email] }
      },
      methods: [
        :boat_type_display, :capacity_text, :length_text, 
        :location_display, :rating_stars, :price_per_hour, 
        :price_per_day, :amenities_list, :images_list, :has_coordinates?
      ]
    }
  end
end
