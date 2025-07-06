class Users::SessionsController < Devise::SessionsController
  skip_before_action :authenticate_request, only: [:create, :destroy]
  respond_to :json

  def create
    user = User.find_by(email: params[:user][:email])
    
    if user&.valid_password?(params[:user][:password])
      token = JWT.encode({ sub: user.id, jti: user.jti }, ENV['DEVISE_JWT_SECRET_KEY'])
      
      render json: {
        status: {
          code: 200, 
          message: 'Logged in successfully.',
          data: { 
            user: UserSerializer.new(user).serializable_hash[:data][:attributes],
            token: token
          }
        }
      }, status: :ok
    else
      render json: {
        status: { 
          code: 401,
          message: "Invalid email or password." 
        }
      }, status: :unauthorized
    end
  end

  def destroy
    if request.headers['Authorization'].present?
      token = request.headers['Authorization'].split(' ').last
      
      begin
        decoded_token = JWT.decode(token, ENV['DEVISE_JWT_SECRET_KEY'])
        user = User.find(decoded_token[0]['sub'])
        user.update(jti: SecureRandom.uuid)
        
        render json: {
          status: {
            code: 200,
            message: 'Logged out successfully.'
          }
        }, status: :ok
      rescue JWT::DecodeError
        render json: {
          status: {
            code: 401,
            message: 'Invalid token.'
          }
        }, status: :unauthorized
      end
    else
      render json: {
        status: {
          code: 401,
          message: 'Token not provided.'
        }
      }, status: :unauthorized
    end
  end
end