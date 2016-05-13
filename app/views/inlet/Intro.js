/**
 * Created by Layman(http://github.com/anysome) on 16/2/19.
 */
import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

export default class Intro extends React.Component {
	render() {
		return (
			<View style={styles.container}>
	        	<Image source={require('../../../resources/images/avatar.png')} style={styles.backgroundImage}/>
	      	</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	backgroundImage: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: null,
		height: null,
		backgroundColor: 'transparent',
		resizeMode: 'cover',
	}
});
