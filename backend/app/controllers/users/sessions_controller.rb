# app/controllers/users/sessions_controller.rb

class Users::SessionsController < Devise::SessionsController
  # include RackSessionsFix # Si la comentaste, déjala comentada.

  respond_to :json

  def create
    # Punto de depuración 1: antes de buscar al usuario
    # binding.break

    current_user = User.find_by(name: params[:user][:name])

    # Punto de depuración 2: después de buscar al usuario
    # binding.break

    if current_user.present?
      # Punto de depuración 3: antes de generar el token
      # binding.break

      token = JWT.encode({ sub: current_user.id, jti: current_user.jti }, ENV['DEVISE_JWT_SECRET_KEY'])

      # Punto de depuración 4: después de generar el token
      # binding.break

      render json: {
        status: {
          code: 200, message: 'Logged in successfully.',
          data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes].merge(token:) }
        }
      }, status: :ok
    else
      # Punto de depuración 5: si el usuario no fue encontrado
      # binding.break

      render json: {
        status: { message: "User couldn't be found." }
      }, status: :unprocessable_entity
    end
  end
end