class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :name, :email, :role, :created_at
  
  attribute :role_display do |user|
    user.role.humanize
  end
end
