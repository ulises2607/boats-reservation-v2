class Api::V1::ReservationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_reservation, only: [:show, :update, :destroy, :confirm, :cancel]
  before_action :ensure_owner_or_user, only: [:show, :update]
  before_action :ensure_owner, only: [:confirm]
  before_action :ensure_user_can_cancel, only: [:cancel, :destroy]

  # GET /api/v1/reservations
  # Lista las reservas del usuario actual
  def index
    @reservations = current_user.reservations
                               .includes(:boat, :user)
                               .order(created_at: :desc)
    
    # Filtros opcionales
    @reservations = @reservations.where(status: params[:status]) if params[:status].present?
    @reservations = @reservations.upcoming if params[:upcoming] == 'true'
    @reservations = @reservations.past if params[:past] == 'true'
    
    render json: {
      status: {
        code: 200,
        message: "Reservations retrieved successfully.",
        data: @reservations.map { |reservation| reservation_with_details(reservation) }
      }
    }, status: :ok
  end

  # GET /api/v1/reservations/my_reservations
  # Lista las reservas del usuario actual (alias para index)
  def my_reservations
    index
  end

  # GET /api/v1/reservations/owner
  # Lista las reservas de los botes del owner actual
  def owner_reservations
    unless current_user.owner? || current_user.admin?
      render json: {
        status: {
          code: 403,
          message: "Access denied. Owner privileges required."
        }
      }, status: :forbidden
      return
    end

    @reservations = current_user.boat_reservations
                               .includes(:boat, :user)
                               .order(created_at: :desc)
    
    # Filtros opcionales
    @reservations = @reservations.where(status: params[:status]) if params[:status].present?
    @reservations = @reservations.upcoming if params[:upcoming] == 'true'
    
    render json: {
      status: {
        code: 200,
        message: "Owner reservations retrieved successfully.",
        data: @reservations.map { |reservation| reservation_with_details(reservation) }
      }
    }, status: :ok
  end

  # GET /api/v1/reservations/:id
  def show
    render json: {
      status: {
        code: 200,
        message: "Reservation retrieved successfully.",
        data: reservation_with_details(@reservation)
      }
    }, status: :ok
  end

  # POST /api/v1/reservations
  def create
    @boat = Boat.find(params[:boat_id])
    
    @reservation = current_user.reservations.build(reservation_params)
    @reservation.boat = @boat

    if @reservation.save
      # TODO: Enviar notificación al owner del bote
      render json: {
        status: {
          code: 201,
          message: "Reservation created successfully.",
          data: reservation_with_details(@reservation)
        }
      }, status: :created
    else
      render json: {
        status: {
          code: 422,
          message: "Reservation could not be created.",
          errors: @reservation.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/reservations/:id
  def update
    if @reservation.update(reservation_update_params)
      render json: {
        status: {
          code: 200,
          message: "Reservation updated successfully.",
          data: reservation_with_details(@reservation)
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: "Reservation could not be updated.",
          errors: @reservation.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/reservations/:id/confirm
  # Solo el owner del bote puede confirmar
  def confirm
    if @reservation.pending?
      @reservation.confirm!
      # TODO: Enviar notificación al usuario
      render json: {
        status: {
          code: 200,
          message: "Reservation confirmed successfully.",
          data: reservation_with_details(@reservation)
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: "Reservation cannot be confirmed. Current status: #{@reservation.status}"
        }
      }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/reservations/:id/cancel
  # Usuario o owner pueden cancelar
  def cancel
    reason = params[:reason] || params[:owner_notes]
    
    if @reservation.can_be_cancelled?
      @reservation.cancel!(reason)
      # TODO: Enviar notificación correspondiente
      render json: {
        status: {
          code: 200,
          message: "Reservation cancelled successfully.",
          data: reservation_with_details(@reservation)
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: "Reservation cannot be cancelled. Current status: #{@reservation.status}"
        }
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/reservations/:id
  # Alias para cancel (por convención REST)
  def destroy
    cancel
  end

  private

  def set_reservation
    @reservation = Reservation.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {
      status: {
        code: 404,
        message: "Reservation not found."
      }
    }, status: :not_found
  end

  def ensure_owner_or_user
    unless @reservation.user == current_user || @reservation.boat.user == current_user || current_user.admin?
      render json: {
        status: {
          code: 403,
          message: "Access denied. You can only access your own reservations."
        }
      }, status: :forbidden
    end
  end

  def ensure_owner
    unless @reservation.boat.user == current_user || current_user.admin?
      render json: {
        status: {
          code: 403,
          message: "Access denied. Only the boat owner can confirm reservations."
        }
      }, status: :forbidden
    end
  end

  def ensure_user_can_cancel
    unless @reservation.user == current_user || @reservation.boat.user == current_user || current_user.admin?
      render json: {
        status: {
          code: 403,
          message: "Access denied. You can only cancel your own reservations or reservations for your boats."
        }
      }, status: :forbidden
    end
  end

  def reservation_params
    params.require(:reservation).permit(:start_date, :end_date, :notes)
  end

  def reservation_update_params
    params.require(:reservation).permit(:notes)
  end

  # Helper para formatear la respuesta de reserva con detalles
  def reservation_with_details(reservation)
    {
      id: reservation.id,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      duration_days: reservation.duration_days,
      daily_rate: reservation.daily_rate,
      total_amount: reservation.total_amount,
      status: reservation.status,
      notes: reservation.notes,
      owner_notes: reservation.owner_notes,
      created_at: reservation.created_at,
      updated_at: reservation.updated_at,
      boat: {
        id: reservation.boat.id,
        name: reservation.boat.name,
        description: reservation.boat.description,
        location: reservation.boat.location,
        capacity: reservation.boat.capacity,
        boat_type: reservation.boat.boat_type,
        picture: reservation.boat.picture,
        owner: {
          id: reservation.boat.user.id,
          name: reservation.boat.user.name,
          email: reservation.boat.user.email
        }
      },
      user: {
        id: reservation.user.id,
        name: reservation.user.name,
        email: reservation.user.email
      },
      permissions: {
        can_cancel: reservation.can_be_cancelled?,
        can_confirm: reservation.pending? && (reservation.boat.user == current_user || current_user.admin?),
        can_edit: reservation.pending? && (reservation.user == current_user || current_user.admin?)
      }
    }
  end
end
