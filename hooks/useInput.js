import React, { useState } from "react"

const useInput = (initialValue) => {
	const [value, setvalue] = useState(initialValue)
	const onChange = (text) => {
		setvalue(text)
	}
	return { value, onChange, setvalue }
}

export default useInput
