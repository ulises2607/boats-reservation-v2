class User < ApplicationRecord
  has_many :boats, dependent: :destroy
  has_many :reservations
  enum :role, { rented: 0, owner: 1, admin: 2 }

  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable, :recoverable, :validatable, :jwt_authenticatable,
         jwt_revocation_strategy: self

  
         

  validates :name, presence: true, uniqueness: true


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
