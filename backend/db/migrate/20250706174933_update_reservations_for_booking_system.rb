class UpdateReservationsForBookingSystem < ActiveRecord::Migration[8.0]
  def change
    # Agregar referencia a users (relación con quien hace la reserva)
    add_reference :reservations, :user, null: false, foreign_key: true, default: 1
    
    # Cambiar el campo date (string) por fechas específicas
    remove_column :reservations, :date, :string
    add_column :reservations, :start_date, :date, null: false
    add_column :reservations, :end_date, :date, null: false
    
    # Agregar campos de precio
    add_column :reservations, :total_amount, :decimal, precision: 10, scale: 2
    add_column :reservations, :daily_rate, :decimal, precision: 8, scale: 2
    
    # Agregar estado de la reserva
    add_column :reservations, :status, :string, default: 'pending', null: false
    
    # Agregar campos de notas
    add_column :reservations, :notes, :text
    add_column :reservations, :owner_notes, :text
    
    # Remover campos que ya no necesitamos
    remove_column :reservations, :username, :string
    remove_column :reservations, :city, :string
    
    # Agregar índices para mejorar performance
    add_index :reservations, :status
    add_index :reservations, [:start_date, :end_date]
    add_index :reservations, [:user_id, :status]
  end
end
