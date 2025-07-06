class Api::V1::AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin_user

  # GET /api/v1/admin/dashboard
  def dashboard
    stats = {
      total_users: User.count,
      total_boats: Boat.count,
      total_reservations: Reservation.count,
      users_by_role: User.group(:role).count,
      recent_users: User.order(created_at: :desc).limit(5).as_json(only: [:id, :name, :email, :role, :created_at]),
      recent_boats: Boat.includes(:user).order(created_at: :desc).limit(5).map do |boat|
        {
          id: boat.id,
          name: boat.name,
          owner: boat.user.name,
          price: boat.rent_price,
          created_at: boat.created_at
        }
      end
    }

    render json: {
      status: {
        code: 200,
        message: "Admin dashboard data retrieved successfully.",
        data: stats
      }
    }, status: :ok
  end

  # GET /api/v1/admin/users
  def users
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 20).to_i
    search = params[:search]

    users_query = User.all
    users_query = users_query.where("name ILIKE ? OR email ILIKE ?", "%#{search}%", "%#{search}%") if search.present?
    
    total_count = users_query.count
    offset = (page - 1) * per_page
    users = users_query.order(:name).limit(per_page).offset(offset)
    
    render json: {
      status: {
        code: 200,
        message: "Users retrieved successfully.",
        data: {
          users: users.map { |user| UserSerializer.new(user).as_json },
          pagination: {
            current_page: page,
            total_pages: (total_count.to_f / per_page).ceil,
            total_count: total_count,
            per_page: per_page
          }
        }
      }
    }, status: :ok
  end

  # PUT /api/v1/admin/users/:id
  def update_user
    user = User.find(params[:id])
    
    if user.update(admin_user_params)
      render json: {
        status: {
          code: 200,
          message: "User updated successfully.",
          data: {
            user: UserSerializer.new(user).as_json
          }
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: "User couldn't be updated.",
          errors: user.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/admin/users/:id
  def delete_user
    user = User.find(params[:id])
    
    if user == current_user
      render json: {
        status: {
          code: 403,
          message: "You cannot delete your own account from admin panel."
        }
      }, status: :forbidden
      return
    end

    if user.destroy
      render json: {
        status: {
          code: 200,
          message: "User deleted successfully."
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: "User couldn't be deleted.",
          errors: user.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/admin/boats
  def boats
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 20).to_i
    search = params[:search]

    boats_query = Boat.includes(:user)
    boats_query = boats_query.where("name ILIKE ? OR description ILIKE ?", "%#{search}%", "%#{search}%") if search.present?
    
    total_count = boats_query.count
    offset = (page - 1) * per_page
    boats = boats_query.order(:name).limit(per_page).offset(offset)
    
    render json: {
      status: {
        code: 200,
        message: "Boats retrieved successfully.",
        data: {
          boats: boats.map do |boat|
            {
              id: boat.id,
              name: boat.name,
              description: boat.description,
              price: boat.price,
              rent_price: boat.rent_price,
              boat_type: boat.boat_type,
              capacity: boat.capacity,
              location: boat.location,
              owner: {
                id: boat.user.id,
                name: boat.user.name,
                email: boat.user.email
              },
              created_at: boat.created_at,
              updated_at: boat.updated_at
            }
          end,
          pagination: {
            current_page: page,
            total_pages: (total_count.to_f / per_page).ceil,
            total_count: total_count,
            per_page: per_page
          }
        }
      }
    }, status: :ok
  end

  # DELETE /api/v1/admin/boats/:id
  def delete_boat
    boat = Boat.find(params[:id])
    
    if boat.destroy
      render json: {
        status: {
          code: 200,
          message: "Boat deleted successfully."
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: "Boat couldn't be deleted.",
          errors: boat.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end

  private

  def ensure_admin_user
    unless current_user.admin?
      render json: {
        status: {
          code: 403,
          message: "Access denied. Admin privileges required."
        }
      }, status: :forbidden
    end
  end

  def admin_user_params
    params.require(:user).permit(:name, :email, :role)
  end
end
