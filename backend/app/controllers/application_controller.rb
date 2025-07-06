class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_request

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name email password password_confirmation role])
    devise_parameter_sanitizer.permit(:sign_in, keys: %i[email password])
  end

  private

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    if header
      begin
        # Usar ENV en lugar de credentials para la clave JWT
        secret_key = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.devise_jwt_secret_key
        decoded = JWT.decode(header, secret_key)
        @current_user = User.find(decoded[0]['sub'])
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound => e
        Rails.logger.error "JWT Authentication failed: #{e.message}"
        @current_user = nil
      end
    else
      @current_user = nil
    end
  end

  def current_user
    @current_user
  end

  def authenticate_user!
    render json: { status: { code: 401, message: 'You need to sign in or sign up before continuing.' } }, status: :unauthorized unless current_user
  end
end
