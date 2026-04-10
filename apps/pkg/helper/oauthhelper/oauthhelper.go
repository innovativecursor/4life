package oauthhelper

import (
	"github.com/innovativecursor/4life/apps/pkg/config"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func GoogleOAuthConfig(redirectURI string) (*oauth2.Config, error) {
	cfg, err := config.Env()
	if err != nil {
		return nil, err
	}

	return &oauth2.Config{
		ClientID:     cfg.GoogleOauth.ClientID,
		ClientSecret: cfg.GoogleOauth.ClientSecret,
		RedirectURL:  redirectURI,
		Scopes:       []string{"profile", "email"},
		Endpoint:     google.Endpoint,
	}, nil
}
