class UsersController < ApplicationController
    
    def create
        new_user = User.create(user_params)
    end

    def show 
    end

    private 
        def user_params
            params.require(:user).permit(:first_name, :last_name, :email, :password_digest)
        end
end