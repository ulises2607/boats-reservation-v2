class Reservation < ApplicationRecord
  # ===============================
  # RELACIONES (Associations)
  # ===============================
  belongs_to :user  # Quien hace la reserva (renter)
  belongs_to :boat  # Qué bote se reserva
  
  # Relación indirecta con el owner del bote
  has_one :owner, through: :boat, source: :user

  # ===============================
  # ENUMS - Estados de la reserva
  # ===============================
  enum :status, {
    pending: 'pending',       # Esperando aprobación del owner
    confirmed: 'confirmed',   # Aprobada por el owner
    cancelled: 'cancelled',   # Cancelada (por user o owner)
    completed: 'completed',   # Finalizada exitosamente
    expired: 'expired'        # Venció sin respuesta
  }

  # ===============================
  # VALIDACIONES
  # ===============================
  
  # Campos requeridos
  validates :start_date, :end_date, :daily_rate, presence: true
  validates :total_amount, presence: true, numericality: { greater_than: 0 }
  validates :daily_rate, numericality: { greater_than: 0 }
  
  # Validaciones de fechas
  validates :start_date, comparison: { greater_than: Date.current, message: "debe ser posterior a hoy" }
  validates :end_date, comparison: { greater_than: :start_date, message: "debe ser posterior a la fecha de inicio" }
  
  # Validación personalizada: evitar reservas duplicadas
  validate :boat_must_be_available
  validate :reasonable_duration
  
  # ===============================
  # CALLBACKS - Acciones automáticas
  # ===============================
  before_validation :set_daily_rate_from_boat, if: :new_record?
  before_validation :calculate_total_amount, if: :should_calculate_total?

  # ===============================
  # SCOPES - Consultas predefinidas
  # ===============================
  scope :for_user, ->(user) { where(user: user) }
  scope :for_boat, ->(boat) { where(boat: boat) }
  scope :for_owner, ->(owner) { joins(:boat).where(boats: { user: owner }) }
  scope :active, -> { where(status: [:pending, :confirmed]) }
  scope :upcoming, -> { where('start_date > ?', Date.current) }
  scope :current, -> { where('start_date <= ? AND end_date >= ?', Date.current, Date.current) }
  scope :past, -> { where('end_date < ?', Date.current) }

  # ===============================
  # MÉTODOS PERSONALIZADOS
  # ===============================
  
  # Duración de la reserva en días
  def duration_days
    return 0 unless start_date && end_date
    (end_date - start_date).to_i + 1  # +1 porque incluye ambos días
  end
  
  # Verifica si la reserva está activa
  def active?
    pending? || confirmed?
  end
  
  # Verifica si la reserva está en curso
  def current?
    confirmed? && start_date <= Date.current && end_date >= Date.current
  end
  
  # Verifica si la reserva ya pasó
  def past?
    end_date < Date.current
  end
  
  # Verifica si puede ser cancelada
  def can_be_cancelled?
    (pending? || confirmed?) && start_date > Date.current
  end
  
  # Confirma la reserva (solo el owner puede hacerlo)
  def confirm!
    update!(status: 'confirmed')
  end
  
  # Cancela la reserva
  def cancel!(reason = nil)
    update!(status: 'cancelled', owner_notes: reason)
  end
  
  # Marca como completada
  def complete!
    update!(status: 'completed') if past? && confirmed?
  end

  private

  # ===============================
  # VALIDACIONES PERSONALIZADAS
  # ===============================
  
  def boat_must_be_available
    return unless boat && start_date && end_date
    
    # Buscar reservas que se solapan en las mismas fechas
    overlapping_reservations = boat.reservations
      .where.not(id: id)  # Excluir la reserva actual (para ediciones)
      .active  # Solo reservas activas (pending o confirmed)
      .where(
        '(start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?) OR (start_date >= ? AND end_date <= ?)',
        start_date, start_date,  # Empieza durante nuestra reserva
        end_date, end_date,      # Termina durante nuestra reserva
        start_date, end_date     # Está completamente dentro de nuestra reserva
      )
    
    if overlapping_reservations.exists?
      errors.add(:start_date, "el bote no está disponible en esas fechas")
    end
  end
  
  def reasonable_duration
    return unless start_date && end_date
    
    if duration_days > 30
      errors.add(:end_date, "la reserva no puede ser mayor a 30 días")
    end
    
    if duration_days < 1
      errors.add(:end_date, "la reserva debe ser de al menos 1 día")
    end
  end

  # ===============================
  # CALLBACKS AUTOMÁTICOS
  # ===============================
  
  def calculate_total_amount
    return unless start_date && end_date && daily_rate
    
    self.total_amount = duration_days * daily_rate
  end
  
  def set_daily_rate_from_boat
    return unless boat
    
    self.daily_rate = boat.rent_price
  end
  
  def should_calculate_total?
    (new_record? || will_save_change_to_start_date? || will_save_change_to_end_date? || will_save_change_to_daily_rate?) &&
    start_date && end_date && daily_rate
  end
end
