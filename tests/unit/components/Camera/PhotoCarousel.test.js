import { render, screen } from "@testing-library/react-native";
import PhotoCarousel from "components/Camera/PhotoCarousel";
import React from "react";

import factory from "../../../factory";
import * as mockReactI18next from "../../../mocks/react-i18next";

jest.mock( "react-i18next", ( ) => mockReactI18next );

const mockPhotoUris = [
  factory( "LocalPhoto" ).url,
  factory( "LocalPhoto" ).url,
  factory( "LocalPhoto" ).url
];

describe( "PhotoCarousel", ( ) => {
  // There were some tests of photo sizes responding to the isLargeScreen prop
  // but somewhat dynamic tailwind classes don't seem to create style props
  // in a test environment, so I'm not sure we can test those now ~~~kueda
  // 20230518
  it( "renders correctly", async () => {
    render(
      <PhotoCarousel photoUris={mockPhotoUris} />
    );

    // Snapshot test
    expect( screen ).toMatchSnapshot();
  } );
  it( "renders correctly for large screen", async () => {
    render(
      <PhotoCarousel photoUris={mockPhotoUris} isLargeScreen />
    );

    // Snapshot test
    expect( screen ).toMatchSnapshot();
  } );
} );
