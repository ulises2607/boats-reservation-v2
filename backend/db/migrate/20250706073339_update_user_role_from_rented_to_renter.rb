class UpdateUserRoleFromRentedToRenter < ActiveRecord::Migration[8.0]
  def up
    # Update existing users with role 'rented' (0) to keep the same value but now it represents 'renter'
    # Since we're changing the enum definition, no data change is needed
    # The value 0 will now represent 'renter' instead of 'rented'
    say "Updated enum definition from 'rented' to 'renter'. Existing data with role=0 now represents 'renter'."
  end

  def down
    # If we need to rollback, we would change the enum back to 'rented'
    say "Rollback: enum definition changed back from 'renter' to 'rented'"
  end
end
