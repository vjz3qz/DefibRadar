import React, { useState } from "react";
import axios from "axios";
import polyline from "@mapbox/polyline";
import sampleData from "../data/mockDirections";
import Config from 'react-native-config';

export const useRoute = () => {
	const mockApiResponse = sampleData;

	const [routeDetails, setRouteDetails] = useState(null);

	const parseResponse = (response) => {
		// checks if a response was received and the status is 'OK'
		if (!response || response.status != "OK") return [];

		const route = response.routes[0]; // the first route listed is the most optimal
		const leg = route.legs[0];

		const coordinates = [];
		const directions = [];
		for (const step of leg.steps) {
			// iterates through each step in the route
			const decodedPoints = polyline.decode(step.polyline.points); // gets all points along the route

			// getting the detail about the directions to be provided in Directions.js component
			const directionDetail = {
				distance: step.distance.text,
				instruction: step.html_instructions,
				maneuver: step.maneuver,
			};
			directions.push(directionDetail);
			for (const point of decodedPoints) {
				coordinates.push({ latitude: point[0], longitude: point[1] }); // pushes the coordinates of each point along the route to the coordinates array
			}
		}

		const lastStep = leg.steps[leg.steps.length - 1];
		coordinates.push({
			latitude: lastStep.end_location.lat,
			longitude: lastStep.end_location.lng,
		});

		return { coordinates, directions };
	};

	const getRouteDetails = async (
		walking,
		startLat,
		startLng,
		endLat,
		endLng
	) => {
		try {
			// GET ROUTE DATA
			// ADD URL TO CONFIG FILE and ADD URL BUILDING
			//const baseUrl = Config.BASE_URL;
			const url = `http://localhost:8000/api/directions/?walking=walking&startLat=startLat&startLng=startLng&endLat=endLat&endLng=endLng`;
			
			// const response = await axios.get(url);

			// SET ROUTE
			const routeDetail = parseResponse(mockApiResponse);
			setRouteDetails(routeDetail);
		} catch (error) {
			console.log("Error fetching data:", error);
		}
	};

	return { routeDetails, setRouteDetails, getRouteDetails };
};
