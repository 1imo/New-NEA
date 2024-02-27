
### External Components Used

- [[Slider Component]]


![[Pasted image 20240225160602.png]]


The input component is a a multi-use-case component which allows for the user to input data, verify and confirm it before submitting. It prompts the user as to what data they need to enter through the use of placeholders. It accepts text and file inputs for now.

It works by accepting a state as a props from a parent component. The component is designed to be used as a stand-alone page or an overlay. Then once the [[Slider Component]] returns true, it will set the state to the value of the input field after [[#Sanitiation & Validation]]. The parent component will then carry on the logic and input processing.

The user can also navigate back to the previous page by pressing the return button to the left of the slider.


### Analyse

To interface with the platform, collect data and for the aire of customization akin to original MySpace, there needs to be an input component which is responsive, intuitive and guides the user into data entry in an interactive way which at the same time removes stress on the API sanitation checks by doing the work client-side too.


### Design

#### Props

![[Pasted image 20240225170346.png]]


#### Sanitiation & Validation

##### Text

If an input is marked as complete, text input must be trimmed removing all surrounding white space as it is unnecessary. Then length checks are performed so as to not allow empty strings or inputs larger than 100 although 100 is rather excessive. If null or too large, an alert will be displayed to the user explaining that they need to rethink their input and allowing them to retry. 

Following on dangerous HTML characters are escaped and replaced using a dictionary lookup table and JavaScript's replace function.

```
const encodedInput = htmlSpecialChars(rawInput)
function htmlSpecialChars(text) {
	const map = {
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&apos;",
		"&": "&amp;",
	}
	return text.replace(/[<>"&]/g, (char) => map[char])
}
```

If the input we are looking for is a password, further validation must be performed in order for all users to have secure passwords. Simple checks that verify passwords include numbers, special characters and capital letters are a must for this. To implement this in a concise way, I implemented regex to test every character of the string and on every met condition, update variables to true. If a condition hasn't been met by the end, the user will be given feedback on what steps they must take in order to create a secure password.

```
if (/\d/.test(char)) {
	hasDigit = true;
}

if (!/\w\s/.test(char)) {
	hasSpecial = true;
}

if (/[A-Z]/.test(char)) {
	hasCapital = true;
}
```

```
if (!hasDigit || !hasSpecial || !hasCapital) {
	if (!hasDigit) {
		alert("Password must have at least 1 digit")
	} else if (!hasSpecial) {
		alert("Password must have at least one special character")
	} else if (!hasCapital) {
		alert("Password must have at least one capital")
	}
	setVerify(false)
	return
}
```

##### Files

Files are checked against their MIME types for now but it is easy to rename a file's extension. File checks should be performed on the [[Image Server]] also.

```
if (props?.type == "file") {
	if (validMimeTypes.includes(e.target.files[0].type)) {
	const display = URL.createObjectURL(e.target.files[0])
	setVal(display)
	}
}
```


#### Submission

After [[#Sanitiation & Validation]], if the input type is a file, the file is converted into an unsigned array of 8 bit values for easy transmission, then the input is passed back to the parent.


#### UI

##### Mobile

![[Pasted image 20240225164208.png]]

##### Desktop

![[Pasted image 20240225164630.png]]


### Tests

#### Test Case 1: Rendering Input Component

Procedure:

1. Render the `Input` component with various props, including different types (text, password, file), placeholders, and referers.
2. Verify that the input field renders correctly based on the provided props.
3. Check if the back button is displayed and functions correctly.
4. If the input type is file, verify that the file input accepts valid image files and displays them correctly.

Expected Result:

- The `Input` component should render correctly with the provided props.
- The input field should display the appropriate type and placeholder text.
- The back button should be displayed and should navigate to the specified referer when clicked or touched.
- If the input type is file, it should accept valid image files and display them correctly.

#### Test Case 2: Completing Input

Procedure:

1. Enter valid input into the input field.
2. Verify that the input is successfully processed and passed to the parent component.
3. If the input type is file, upload a valid image file and verify that it is processed correctly.

Expected Result:

- The entered input should be successfully processed and passed to the parent component.
- If the input type is file, the uploaded image file should be processed correctly and passed to the parent component.