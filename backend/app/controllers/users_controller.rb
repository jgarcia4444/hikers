class UsersController < ApplicationController
    
    def create
        new_user = User.create(user_params)
        render json: new_user
    end

    def show 
    end

    private 
        def user_params
            params.permit(:first_name, :last_name, :email, :password)
        end
end