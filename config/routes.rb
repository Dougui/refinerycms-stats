::Refinery::Application.routes.draw do
  resources :stats, :only => [:index, :show]

  scope(:path => 'refinery', :as => 'admin', :module => 'admin') do
    resources :stats, :except => :show do
      collection do
        post :update_positions
      end
    end
  end
end
