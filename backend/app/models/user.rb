class User < ApplicationRecord
  # ===============================
  # RELACIONES
  # ===============================
  has_many :boats, dependent: :destroy
  
  # Reservas que el usuario ha hecho (como renter)
  has_many :reservations, dependent: :destroy
  
  # Reservas en los botes del usuario (como owner)
  has_many :boat_reservations, through: :boats, source: :reservations
  
  # ===============================
  # ENUMS
  # ===============================
  enum :role, { renter: 0, owner: 1, admin: 2 }

  # ===============================
  # DEVISE (Autenticación)
  # ===============================
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable, :recoverable, :validatable, :jwt_authenticatable,
         jwt_revocation_strategy: self

  # ===============================
  # VALIDACIONES
  # ===============================
  validates :name, presence: true, uniqueness: true

  # ===============================
  # MÉTODOS ÚTILES
  # ===============================
  
  # Reservas pendientes que necesitan aprobación (para owners)
  def pending_reservations
    boat_reservations.pending
  end
  
  # Reservas activas del usuario (como renter)
  def active_reservations
    reservations.active
  end
  
  # Próximas reservas del usuario
  def upcoming_reservations
    reservations.upcoming.confirmed
  end


  # def email_required?
  #   false
  # end

  # def email_changed?
  #   false
  # end

  # def will_save_change_to_email?
  #   false
  # end

  # def password_required?
  #   false
  # end
end
