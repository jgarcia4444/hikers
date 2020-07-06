class UsersController < ApplicationController
    
    def create
    end

    def show 
    end

    private 
        def user_params
            params.require(:user).permit(:first_name, :last_name, :password, :email)
        end
end