class Api::V1::CurrentUserController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: {
      status: {
        code: 200,
        message: 'Current user retrieved successfully.',
        data: {
          user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
        }
      }
    }, status: :ok
  rescue => e
    render json: {
      status: {
        code: 401,
        message: 'User not authenticated.'
      }
    }, status: :unauthorized
  end
end
