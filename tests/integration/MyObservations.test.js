// These test ensure that My Observation integrates with other systems like
// remote data retrieval and local data persistence

import { screen, waitFor } from "@testing-library/react-native";
import MyObservationsContainer from "components/MyObservations/MyObservationsContainer";
import initI18next from "i18n/initI18next";
import i18next from "i18next";
import inatjs from "inaturalistjs";
import React from "react";

import factory, { makeResponse } from "../factory";
import { renderAppWithComponent } from "../helpers/render";
import { signIn, signOut } from "../helpers/user";

jest.mock( "@react-navigation/native", ( ) => {
  const actualNav = jest.requireActual( "@react-navigation/native" );
  return {
    ...actualNav,
    addEventListener: ( ) => {}
  };
} );

describe( "MyObservations", ( ) => {
  beforeAll( async ( ) => {
    await initI18next( );
  } );

  beforeEach( signOut );

  afterEach( ( ) => {
    jest.clearAllMocks( );
  } );

  // For some reason this interferes with the "should not make a request to
  // users/me" test below, can't figure out why ~~~kueda 20230105
  // TODO: this looks to me more like it should be covered by unit tests - @jtklein
  // describe( "accessibility", ( ) => {
  //   it( "should not have accessibility errors", async ( ) => {
  //     const mockUser = factory( "LocalUser" );
  //     await signIn( mockUser );
  //     const observations = [factory( "RemoteObservation" )];
  //     inatjs.observations.search.mockResolvedValue( makeResponse( observations ) );
  //     renderAppWithComponent( <ObsList /> );
  //     const { findByTestId } = renderAppWithComponent( <ObsList /> );
  //     expect( await screen.findByTestId( "ObservationViews.myObservations" ) ).toBeAccessible( );
  //   } );
  // } );

  describe( "when signed out", ( ) => {
    async function testApiMethodNotCalled( apiMethod ) {
      // Let's make sure the mock hasn't already been used
      expect( apiMethod ).not.toHaveBeenCalled( );
      const signedInUsers = global.realm.objects( "User" ).filtered( "signedIn == true" );
      expect( signedInUsers.length ).toEqual( 0 );
      renderAppWithComponent( <MyObservationsContainer /> );
      const loginText = i18next.t( "Log-in-to-contribute-your-observations" );
      expect( await screen.findByText( loginText ) ).toBeTruthy( );
      // Unpleasant, but without adjusting the timeout it doesn't seem like
      // all of these requests get caught
      await waitFor( ( ) => {
        expect( apiMethod ).not.toHaveBeenCalled( );
      }, { timeout: 3000, interval: 500 } );
    }
    it( "should not make a request to users/me", async ( ) => {
      await testApiMethodNotCalled( inatjs.users.me );
    } );
    it( "should not make a request to observations/updates", async ( ) => {
      await testApiMethodNotCalled( inatjs.observations.updates );
    } );
  } );

  describe( "when signed in", ( ) => {
    beforeEach( async ( ) => {
      const mockUser = factory( "LocalUser" );
      await signIn( mockUser );
    } );

    it( "should make a request to observations/updates", async ( ) => {
      // Let's make sure the mock hasn't already been used
      expect( inatjs.observations.updates ).not.toHaveBeenCalled();
      renderAppWithComponent( <MyObservationsContainer /> );
      expect( await screen.findByText( /Welcome back/ ) ).toBeTruthy();
      expect( inatjs.observations.updates ).toHaveBeenCalled();
    } );
  } );

  describe( "localization for current user", ( ) => {
    it( "should be English by default", async ( ) => {
      const mockUser = factory( "LocalUser" );
      expect( mockUser.locale ).toEqual( "en" );
      await signIn( mockUser );
      renderAppWithComponent( <MyObservationsContainer /> );
      await waitFor( ( ) => {
        expect( screen.getByText( /Welcome back/ ) ).toBeTruthy( );
      } );
      expect( screen.queryByText( /Welcome-user/ ) ).toBeFalsy( );
    } );

    it( "should be Spanish if signed in user's locale is Spanish", async ( ) => {
      const mockSpanishUser = factory( "LocalUser", {
        locale: "es"
      } );
      expect( mockSpanishUser.locale ).toEqual( "es" );
      await signIn( mockSpanishUser );
      renderAppWithComponent( <MyObservationsContainer /> );
      await waitFor( ( ) => {
        expect( screen.getByText( /Bienvenido a iNaturalist/ ) ).toBeTruthy();
      } );
      expect( screen.queryByText( /Welcome/ ) ).toBeFalsy( );
    } );

    it(
      "should change to es when local user locale is en but remote user locale is es",
      async ( ) => {
        const mockUser = factory( "LocalUser" );
        expect( mockUser.locale ).toEqual( "en" );
        await signIn( mockUser );

        const mockSpanishUser = factory( "LocalUser", {
          locale: "es"
        } );
        inatjs.users.me.mockResolvedValue( makeResponse( [mockSpanishUser] ) );

        renderAppWithComponent( <MyObservationsContainer /> );
        // I'd prefer to wait for the Spanish text to appear, but that never
        // seems to wait long enough. This waits for the relevant API call to
        // have been made
        await waitFor( ( ) => {
          expect( inatjs.users.me ).toHaveBeenCalled( );
        } );
        expect( screen.getByText( /Bienvenido a iNaturalist/ ) ).toBeTruthy( );
        expect( screen.queryByText( /Welcome/ ) ).toBeFalsy( );
      }
    );
  } );
} );
