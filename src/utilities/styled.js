import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DoubleRingSVG from './../Assets/Double Ring-3s-200px.svg';
import DoubleRingSVGWhite from './../Assets/DoubleRingWhite.svg';
import React from 'react';
export function LoadingWrapper({ text, children, loading, page, logo }) {
	let loadingVisual = (
		<NoDiv just="center" align="center" height="100vh" direction="column">
			{text ? (
				<h1>{text}</h1>
			) : (
				<img src="https://res.cloudinary.com/lift-local/image/upload/v1576106033/swg0nnrcqhe3heqpqt0w.png" alt="Logo" style={{ maxHeight: '200px' }} />
			)}
			<svg style={{ width: '100px', marginTop: '-20px', marginLeft: '60px' }} viewBox="0 0 128 16">
				<path
					fill="#949494"
					fillOpacity="0.42"
					d="M6.4,4.8A3.2,3.2,0,1,1,3.2,8,3.2,3.2,0,0,1,6.4,4.8Zm12.8,0A3.2,3.2,0,1,1,16,8,3.2,3.2,0,0,1,19.2,4.8ZM32,4.8A3.2,3.2,0,1,1,28.8,8,3.2,3.2,0,0,1,32,4.8Zm12.8,0A3.2,3.2,0,1,1,41.6,8,3.2,3.2,0,0,1,44.8,4.8Zm12.8,0A3.2,3.2,0,1,1,54.4,8,3.2,3.2,0,0,1,57.6,4.8Zm12.8,0A3.2,3.2,0,1,1,67.2,8,3.2,3.2,0,0,1,70.4,4.8Zm12.8,0A3.2,3.2,0,1,1,80,8,3.2,3.2,0,0,1,83.2,4.8ZM96,4.8A3.2,3.2,0,1,1,92.8,8,3.2,3.2,0,0,1,96,4.8Zm12.8,0A3.2,3.2,0,1,1,105.6,8,3.2,3.2,0,0,1,108.8,4.8Zm12.8,0A3.2,3.2,0,1,1,118.4,8,3.2,3.2,0,0,1,121.6,4.8Z"
				/>
				<g>
					<path
						fill="#000000"
						fillOpacity="1"
						d="M-42.7,3.84A4.16,4.16,0,0,1-38.54,8a4.16,4.16,0,0,1-4.16,4.16A4.16,4.16,0,0,1-46.86,8,4.16,4.16,0,0,1-42.7,3.84Zm12.8-.64A4.8,4.8,0,0,1-25.1,8a4.8,4.8,0,0,1-4.8,4.8A4.8,4.8,0,0,1-34.7,8,4.8,4.8,0,0,1-29.9,3.2Zm12.8-.64A5.44,5.44,0,0,1-11.66,8a5.44,5.44,0,0,1-5.44,5.44A5.44,5.44,0,0,1-22.54,8,5.44,5.44,0,0,1-17.1,2.56Z"
					/>
					<animateTransform
						attributeName="transform"
						type="translate"
						values="23 0;36 0;49 0;62 0;74.5 0;87.5 0;100 0;113 0;125.5 0;138.5 0;151.5 0;164.5 0;178 0"
						calcMode="discrete"
						dur="1170ms"
						repeatCount="indefinite"
					/>
				</g>
			</svg>
		</NoDiv>
	);
	let landingVisual = (
		<NoDiv just="center" align="center" height="100vh" direction="column">
			<img src={logo} alt="Logo" style={{ maxHeight: '200px' }} />
			<svg style={{ width: '100px', marginTop: '-20px', marginLeft: '60px' }} viewBox="0 0 128 16">
				<path
					fill="#949494"
					fillOpacity="0.42"
					d="M6.4,4.8A3.2,3.2,0,1,1,3.2,8,3.2,3.2,0,0,1,6.4,4.8Zm12.8,0A3.2,3.2,0,1,1,16,8,3.2,3.2,0,0,1,19.2,4.8ZM32,4.8A3.2,3.2,0,1,1,28.8,8,3.2,3.2,0,0,1,32,4.8Zm12.8,0A3.2,3.2,0,1,1,41.6,8,3.2,3.2,0,0,1,44.8,4.8Zm12.8,0A3.2,3.2,0,1,1,54.4,8,3.2,3.2,0,0,1,57.6,4.8Zm12.8,0A3.2,3.2,0,1,1,67.2,8,3.2,3.2,0,0,1,70.4,4.8Zm12.8,0A3.2,3.2,0,1,1,80,8,3.2,3.2,0,0,1,83.2,4.8ZM96,4.8A3.2,3.2,0,1,1,92.8,8,3.2,3.2,0,0,1,96,4.8Zm12.8,0A3.2,3.2,0,1,1,105.6,8,3.2,3.2,0,0,1,108.8,4.8Zm12.8,0A3.2,3.2,0,1,1,118.4,8,3.2,3.2,0,0,1,121.6,4.8Z"
				/>
				<g>
					<path
						fill="#000000"
						fillOpacity="1"
						d="M-42.7,3.84A4.16,4.16,0,0,1-38.54,8a4.16,4.16,0,0,1-4.16,4.16A4.16,4.16,0,0,1-46.86,8,4.16,4.16,0,0,1-42.7,3.84Zm12.8-.64A4.8,4.8,0,0,1-25.1,8a4.8,4.8,0,0,1-4.8,4.8A4.8,4.8,0,0,1-34.7,8,4.8,4.8,0,0,1-29.9,3.2Zm12.8-.64A5.44,5.44,0,0,1-11.66,8a5.44,5.44,0,0,1-5.44,5.44A5.44,5.44,0,0,1-22.54,8,5.44,5.44,0,0,1-17.1,2.56Z"
					/>
					<animateTransform
						attributeName="transform"
						type="translate"
						values="23 0;36 0;49 0;62 0;74.5 0;87.5 0;100 0;113 0;125.5 0;138.5 0;151.5 0;164.5 0;178 0"
						calcMode="discrete"
						dur="1170ms"
						repeatCount="indefinite"
					/>
				</g>
			</svg>
		</NoDiv>
	);
	return <>{loading ? (page === 'landing' && logo ? landingVisual : loadingVisual) : children}</>;
}
export let triangle = (
	<svg id="Capa_1" enableBackground="new 0 0 511.971 511.971" height="15" viewBox="0 0 511.971 511.971" width="15" xmlns="http://www.w3.org/2000/svg">
		<path d="m403.75 422.335c0 5.522 4.478 10 10 10h20.001c3.572 0 6.874-1.906 8.66-5s1.786-6.906 0-10l-177.768-307.904c-1.786-3.094-5.088-5-8.66-5s-6.874 1.906-8.66 5l-177.768 307.904c-1.786 3.094-1.786 6.906 0 10s5.088 5 8.66 5h245.535c5.522 0 10-4.478 10-10s-4.478-10-10-10h-228.214l160.447-277.903 160.447 277.903h-2.681c-5.522 0-9.999 4.477-9.999 10z" />
		<path d="m507.225 429.835-220.786-382.413c-6.199-11.043-17.498-17.689-30.24-17.783-.091-.001-.181-.001-.271-.001-12.603 0-23.872 6.493-30.187 17.414l-21.616 37.44c-2.762 4.783-1.123 10.898 3.66 13.66 4.785 2.761 10.899 1.123 13.66-3.66l21.613-37.435c3.905-6.755 10.414-7.427 12.992-7.42 5.481.041 10.328 2.883 12.966 7.604.022.042.046.082.069.123l220.822 382.477c2.743 4.743 2.748 10.18.014 14.915-2.721 4.711-7.548 7.522-12.926 7.522h-.014l-441.999.056c-8.101 0-11.918-5.545-13.184-7.929-2.674-5.037-2.396-10.816.745-15.459.134-.196.26-.397.378-.604l153.522-265.908c2.762-4.783 1.123-10.898-3.66-13.66-4.784-2.762-10.899-1.122-13.66 3.66l-153.358 265.626c-7.05 10.671-7.683 24.322-1.631 35.723 6.166 11.616 17.698 18.551 30.85 18.551l441.99-.056h.033c12.596 0 23.897-6.548 30.233-17.521 6.314-10.932 6.307-23.99-.015-34.922z" />
		<path d="m184.737 136.787c1.705 1.137 3.632 1.681 5.538 1.681 3.23 0 6.402-1.563 8.329-4.454l.004-.006c3.063-4.595 1.82-10.801-2.775-13.864-4.596-3.063-10.806-1.819-13.869 2.776-3.064 4.594-1.823 10.803 2.773 13.867z" />
		<path d="m368.746 412.335c-5.522 0-9.996 4.478-9.996 10s4.481 10 10.004 10 10-4.478 10-10-4.478-10-10-10z" />
		<path d="m347.601 331.122c1.792-3.098 1.792-6.917 0-10.016-7.712-13.331-18.135-24.598-30.335-33.262l6.269-10.858c2.762-4.782 1.123-10.898-3.66-13.66-4.784-2.761-10.898-1.123-13.66 3.66l-6.269 10.857c-10.642-4.877-22.116-8.013-33.975-9.148v-12.493c0-5.522-4.478-10-10-10s-10 4.478-10 10v12.493c-11.859 1.135-23.333 4.271-33.976 9.147l-6.268-10.856c-2.762-4.781-8.876-6.422-13.66-3.66-4.783 2.762-6.422 8.878-3.66 13.66l6.269 10.857c-12.201 8.665-22.625 19.932-30.337 33.263-1.792 3.099-1.792 6.918 0 10.016 7.712 13.331 18.136 24.598 30.336 33.262l-6.269 10.858c-2.762 4.783-1.123 10.899 3.66 13.66 1.575.909 3.294 1.342 4.99 1.342 3.456 0 6.818-1.794 8.67-5.002l6.268-10.857c10.642 4.877 22.117 8.013 33.976 9.148v12.492c0 5.522 4.478 10 10 10s10-4.478 10-10v-12.492c11.859-1.136 23.333-4.271 33.976-9.148l6.268 10.857c1.853 3.208 5.213 5.002 8.67 5.002 1.696 0 3.416-.433 4.99-1.342 4.783-2.761 6.422-8.877 3.66-13.66l-6.269-10.858c12.2-8.664 22.624-19.931 30.336-33.262zm-91.632 32.89c-28.557 0-55.317-14.384-71.187-37.897 15.869-23.515 42.629-37.897 71.187-37.897s55.317 14.383 71.187 37.897c-15.869 23.513-42.63 37.897-71.187 37.897z" />
		<path d="m255.969 296.114c-16.542 0-30 13.458-30 30s13.458 30 30 30c16.543 0 30.001-13.458 30.001-30s-13.458-30-30.001-30zm0 40c-5.514 0-10-4.486-10-10s4.486-10 10-10c5.515 0 10.001 4.486 10.001 10s-4.486 10-10.001 10z" />
	</svg>
);

export function LoadingWrapperSmall({ children, loading, style, text }) {
	let loadingVisual = (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			{text ? <h6>{text}</h6> : null}
			<img style={{ width: '35px', height: '35px' }} src={DoubleRingSVG} alt="Double Ring SVG" />
		</div>
	);
	return <>{loading ? loadingVisual : <div style={style}>{children}</div>}</>;
}
export function LoadingWrapperSmallWhite({ children, loading, style }) {
	let loadingVisual = <img style={{ width: '35px', height: '35px', zIndex: '50' }} src={DoubleRingSVGWhite} alt="Double Ring SVG" />;
	return <>{loading ? loadingVisual : <div style={style}>{children}</div>}</>;
}
export const proper = str => {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

export const Grid = styled.div`
	width: 100%;
	min-height: 100vh;
	display: grid;
	grid-template-rows: auto;
	grid-template-areas:
		'header'
		'content';
	/* "footer"; */
`;
// =================================================
// LAYOUT STYLING
export const HeaderHolder = styled.div`
	display: flex;
	width: 100vw;
	height: 5vh;
	grid-area: header;
	position: fixed;
	z-index: 100;
	background-color: #00283d;
`;
export const SideBarContainer = styled.div`
	position: fixed;
	display: flex;
	width: ${props => (props.width ? props.width : '10vw')};
	height: -webkit-calc(100% - 4vh);
	bottom: 0;
	/* border: solid red 2px; */
	user-select: none;
	-webkit-user-select: none; /* Chrome all / Safari all */
	-moz-user-select: none; /* Firefox all             */
	-ms-user-select: none; /* IE 10+                  */
	user-select: none;
`;
export const ContentHolder = styled.div`
	position: relative;
	grid-area: content;
	display: flex;
	width: -webkit-calc(85%);
	top: 8vh;
	left: ${props => (props.left ? props.left : '10vw')};
	@media (max-width: 500px) {
		width: 100vw;
		left: 0;
	}
	/* border: solid blue 2px; */
`;
export const MarketContent = styled.div`
	position: relative;
	grid-area: content;
	/* top: 5vh; */
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70vw;
	max-height: 100vh;
`;
export const LoginContentHolder = styled.div`
	position: relative;
	grid-area: content;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: ${props => (props.width ? props.width : '30vw')};
	height: 100vh;
	background-color: white;
	@media (max-width: 500px) {
		width: 100vw;
		left: 0;
	}
	border-right: solid black 2px;
	box-shadow: 5px 0 2.5px -2px #888;
	/* border-radius: 2.5%; */
`;
export const LoginChildFlexContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	/* border: solid orange 2px; */
	max-height: ${props => (props.height ? props.height : '50vh')};
	width: 90%;
`;
export const ChildFlexContainer = styled.div`
	display: flex;
	flex-flow: column;
	align-items: center;
	width: 100%;
	position: relative;
	height: fit-content;
	padding-bottom: 60px;
	//border: solid orange 2px;
`;
export const Login = styled.div`
	display: flex;
`;
export const FooterContainer = styled.div`
	position: absolute;
	bottom: 0;
	height: 50px;
	z-index: 2;
	width: 94%;
	border-top: 1px solid black;
	margin-top: 16px;
	padding-top: 16px;
	margin-left: 1vw;
	// border: solid black 2px;
`;
// =================================================
// =================================================
export const InfoContainer = styled.div`
	/* width: 95%; */
	height: 10vh;
	margin: 0.5vh;
	:hover {
		cursor: pointer;
	}
`;
export const MainContain = styled.div`
	width: ${props => (props.width ? props.width : '95%')};
	height: ${props => (props.height ? props.height : '10vh')};
	display: flex;
	justify-content: ${props => (props.just ? props.just : '')};
	align-items: ${props => (props.align ? props.align : '')};
	padding: ${props => (props.padding ? props.padding : 0)};
	border: solid black 1px;
	font-size: 1.2em;
	border-radius: 10px;
	box-shadow: 2.5px 0px 5px lightgray;
	z-index: 0;
`;
export const InfoName = styled.div`
	width: 15%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding-left: 2.5%;
	margin-right: 18vw;
	text-align: left;
`;
export const InfoReviews = styled.div`
	width: 10%;
	display: flex;
	justify-content: center;
	align-items: center;
`;
export const InfoGRating = styled.div`
	width: 10%;
	display: flex;
	justify-content: center;
	align-items: center;
`;
export const InfoLLRating = styled.div`
	width: 10%;
	display: flex;
	justify-content: center;
	align-items: center;
`;
export const InfoStatus = styled.div`
	width: 10%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 0.8em;
	border: solid black 1px;
	background-color: ${props =>
		props.color === 'CRITICAL'
			? 'red'
			: props.color === 'URGENT'
			? 'orange'
			: props.color === 'NEED ATTENTION'
			? 'yellow'
			: props.color === 'GOOD'
			? 'Green'
			: 'purple'};
`;
export const InfoActive = styled.div`
	width: 20%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const DropContainer = styled.div`
	width: 100%;
	z-index: 5;
	background-color: yellow;
`;
export const StyledLink = styled(Link)`
	/* font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  box-sizing: border-box;
  font-family: 'Heebo', sans-serif;
  z-index: 0;
  text-decoration: none;
  color: black;
  background-color: #00D885;
  border: solid black 1px;
  margin: 8px;
  padding: 8px;
  :hover {
    background-color: rgba(0, 214, 132, 0.5);
  } */
`;
export const DefaultLink = styled(Link)`
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
	box-sizing: border-box;
	font-family: 'Heebo', sans-serif;
	z-index: 0;
	text-decoration: none;
	color: black;
	// margin: 8px;
	// padding: 8px;
`;
export const LargeContentHolder = styled.div`
	// border: solid black 1px;
	min-width: ${props => (props.width ? props.width : '80vw')};
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-left: ${props => (props.left ? props.left : '5vw')};
`;
export const LoginContainer = styled.div`
	border: solid black 1px;
`;
export const EmailEditor = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: solid black 1px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	color: black;
	font-family: arial;
	background-color: transparent;
`;
export const EmailContainer = styled.div`
	position: relative;
	right: 0;
	margin-right: ${props => (props.right ? props.right : '10%')};
	width: 750px;
	min-width: '600px';
	display: flex;
	align-items: center;
	justify-content: center;
	// border: solid black 1px;
`;
export const AddonContainer = styled.div`
	position: relative;
	right: 0;
	margin-right: 10%;
	width: 80%;
	height: 30vw;
	display: flex;
	align-items: center;
	justify-content: center;
	border: solid black 1px;
`;
export const ThreeSplit = styled.div`
	// border: solid black 1px;
	display: flex;
	flex-wrap: wrap;
	justify-content: ${props => (props.just ? props.just : 'space-around')};
	align-items: ${props => (props.align ? props.align : 'center')};
	width: 100%;
	height: ${props => (props.height ? props.height : '40vh')};
	margin: ${props => (props.margin ? props.margin : '')};
	padding: ${props => (props.padding ? props.padding : '.5%')};
`;
export const BoxSplit = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: ${props => (props.just ? props.just : 'center')};
	align-items: ${props => (props.align ? props.align : 'center')};
	height: ${props => (props.height ? props.height : '90%')};
	width: ${props => props.width};
	padding: ${props => (props.padding ? props.padding : '')};
	margin: ${props => (props.margin ? props.margin : '.5%')};
`;
export const ReportTable = styled.table`
	border-left: solid black 1px;
	border-right: solid black 1px;
`;
export const RowContainer = styled.div`
	// border: solid black 1px;
	display: flex;
	justify-content: space-around;
	// margin: 8px;
	// height: 2vh;
	width: ${props => (props.width ? props.width : '80%')};
`;
export const MapTR = styled.tr`
	background-color: ${props => (props.index % 2 === 1 ? 'rgb(240, 240, 240)' : 'white')};
`;
export const CompanyInfoBox = styled.div`
	width: ${props => (props.width ? props.width : '80%')};
	margin: ${props => (props.margin ? props.margin : '')};
	padding: ${props => (props.padding ? props.padding : '')}
	// border: solid black 1px;
	height: 12vh;
	display: flex;
	justify-content: ${props => (props.just ? props.just : 'flex-end')};
`;
export const Infobox = styled.div`
	margin: ${props => (props.margin ? props.margin : '')};
	border: ${props => (props.border ? props.border : '')};
	border-right: ${props => (props.rborder ? 'solid black 1px' : '')};
	display: flex;
	flex-direction: ${props => (props.direction ? props.direction : 'column')};
	// justify-content: ${props => (props.just ? props.just : 'center')};
	align-items: ${props => (props.align ? props.align : 'center')};
	height: ${props => (props.height ? props.height : '100%')};
	width: ${props => (props.width ? props.width : '12.5%')};
	padding: ${props => (props.padding ? props.padding : '')};
`;
export const StatusTD = styled.td`
	background-color: ${props =>
		props.status === 'CRITICAL'
			? 'rgba(200, 0, 0, .8)'
			: props.status === 'URGENT'
			? 'rgba(255, 40, 0, 0.8)'
			: props.status === 'NEED ATTENTION'
			? 'rgba(255, 217, 0, 0.8)'
			: props.status === 'GOOD'
			? 'rgba(0, 255, 0, 0.5)'
			: props.status === 'SLOW'
			? 'rgba(98, 0, 255, 0.5)'
			: ''};
`;
export const NoDiv = styled.div`
	display: flex;
	flex-direction: ${props => (props.direction ? props.direction : 'row')};
	justify-content: ${props => (props.just ? props.just : 'flex-start')};
	align-items: ${props => (props.align ? props.align : 'flex-start')};
	margin: ${props => (props.margin ? props.margin : 0)};
	padding: ${props => (props.padding ? props.padding : 0)};
	border: ${props => (props.border ? props.border : 0)};
	height: ${props => (props.height ? props.height : 'auto')};
	width: ${props => (props.width ? props.width : 'auto')};
	:hover {
		cursor: ${props => (props.cursor ? props.cursor : '')};
	}
`;
export const ImgBox = styled.img`
	/* border: solid black 2px; */
	height: ${props => (props.height ? props.height : '25vh')};
	max-width: ${props => (props.width ? props.width : '30vw')};
	display: flex;
	justify-content: center;
	align-items: center;
`;
export const StyledReviewLinks = styled.div`
	display: flex;
	justify-content: center;
	background-color: ${props => {
		let site = props.site;
		if (site === 'Google') {
			return '#449ff4';
		} else if (site === 'Facebook') {
			return '#5173b3';
		}
	}};
	border-radius: 25px 25px
	transition-timing-function: ease-in;
	transition: 1.5s;
	:hover {
		transition-timing-function: ease-out;
		transition: 0.5s;
		background-color: ${props => {
			let site = props.site;
			if (site === 'Google') {
				return 'rgba(66, 134, 244, 0.5)';
			} else if (site === 'Facebook') {
				return 'rgba(60, 89, 153, 0.8)';
			}
		}};
		cursor: pointer;
	}
	align-items: center;
	height: 5vh;
	width: 90%;
	color: white;
	font-size: 1.5em;
`;
export const Logos = site => {
	if (site === 'Google') {
		return 'https://www.sccpre.cat/png/big/31/316487_google-logo-png.png';
	} else if (site === 'Facebook') {
		return 'https://brandpalettes.com/wp-content/uploads/2018/05/facebook_color_codes-768x768.png';
	}
};
export const SideBarLink = styled(Link)`
	text-decoration: none;
	display: flex;
	justify-content: flex-start;
	border: none;
	text-decoration: none;
	padding: 0 5%;
	margin: 0;
	margin-left: ${props => (props.indent ? props.indent : '0')};
	align-items: center;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	:hover {
		cursor: pointer;
		background-color: #ffffff10;
	}
`;
export const SideBarButton = styled.div`
	text-decoration: none;
	display: flex;
	justify-content: flex-start;
	border: none;
	text-decoration: none;
	padding: 0 5%;
	margin: 0;
	margin-left: ${props => (props.indent ? props.indent : '0')};
	align-items: center;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	:hover {
		cursor: pointer;
		background-color: #ffffff10;
	}
`;
export const SideBarComponentDiv = styled.div`
	display: ${props => (props.flex ? props.flex : 'flex')};
	flex-direction: column;
	align-items: center;
	width: 100%;
`;
export default {
	SideBarComponentDiv,
	SideBarLink,
	ImgBox,
	StatusTD,
	BoxSplit,
	HeaderHolder,
	SideBarContainer,
	ContentHolder,
	LoginContentHolder,
	ChildFlexContainer,
	LoginChildFlexContainer,
	FooterContainer,
	InfoContainer,
	MainContain,
	DropContainer,
	LargeContentHolder,
	LoginContainer,
	MarketContent,
	Login,
	MapTR,
	EmailEditor,
	AddonContainer,
	EmailContainer,
	ThreeSplit,
	ReportTable,
	RowContainer,
	DefaultLink,
	CompanyInfoBox,
	Infobox,
	proper,
	LoadingWrapperSmall,
	triangle,
};
