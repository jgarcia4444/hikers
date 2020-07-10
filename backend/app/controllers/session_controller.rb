class SessionController < ApplicationController

    def current_user
        if session[:id] 
            user = User.find(session[:id])
            render json: user
        end
    end

end