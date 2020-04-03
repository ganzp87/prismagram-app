const options = {
	uri:
		process.env.NODE_ENV === "development"
			? "http://192.168.0.3:4000"
			: "https://prismagram-backendd.herokuapp.com/"
}

export default options
