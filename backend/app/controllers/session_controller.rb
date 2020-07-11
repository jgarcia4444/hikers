class SessionController < ApplicationController

    def login
        if user = User.find_by(email: params[:email])
            if user = user.authenticate(params[:password])
                render json: user
            end
        end
        
    end

end