class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  before_action :set_user, only: [:show, :update, :destroy]
  before_action :ensure_own_profile_or_admin, only: [:show, :update, :destroy]

  # GET /api/v1/users
  def index
    @users = User.all
    render json: @users
  end

  # GET /api/v1/users/:id
  def show
    render json: {
      status: {
        code: 200,
        message: "User profile retrieved successfully.",
        data: {
          user: UserSerializer.new(@user).as_json
        }
      }
    }, status: :ok
  end

  # PUT /api/v1/users/:id
  def update
    if @user.update(user_params)
      render json: {
        status: {
          code: 200,
          message: "Profile updated successfully.",
          data: {
            user: UserSerializer.new(@user).as_json
          }
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: "Profile couldn't be updated.",
          errors: @user.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/:id
  def destroy
    if @user.destroy
      render json: {
        status: {
          code: 200,
          message: "Account deleted successfully."
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: "Account couldn't be deleted.",
          errors: @user.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {
      status: {
        code: 404,
        message: "User not found."
      }
    }, status: :not_found
  end

  def ensure_own_profile_or_admin
    unless @user == current_user || current_user.admin?
      render json: {
        status: {
          code: 403,
          message: "Access denied. You can only manage your own profile."
        }
      }, status: :forbidden
    end
  end

  def user_params
    # Allow role updates only for admins
    permitted_params = [:name, :email]
    permitted_params << :role if current_user.admin?
    
    params.require(:user).permit(permitted_params)
  end
end
