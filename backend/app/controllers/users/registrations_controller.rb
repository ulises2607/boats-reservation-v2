class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_action :authenticate_request, only: [:create]
  respond_to :json

  def create
    @user = User.new(sign_up_params)

    if @user.save
      token = JWT.encode({ sub: @user.id, jti: @user.jti }, ENV['DEVISE_JWT_SECRET_KEY'])
      
      render json: {
        status: {
          code: 201, 
          message: 'Signed up successfully.',
          data: { 
            user: UserSerializer.new(@user).serializable_hash[:data][:attributes],
            token: token
          }
        }
      }, status: :created
    else
      render json: {
        status: { 
          code: 422,
          message: "User couldn't be created successfully.", 
          errors: @user.errors.full_messages 
        }
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :role)
  end
end
