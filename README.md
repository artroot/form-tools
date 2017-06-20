# [form-tools](http://artsemenishch.inf.ua/docs/projects/js/form-tools)

The simple cloning of node by template.

## Motivation

* Declarative style of defining bindings and rules;
* Flexibility of template.

Try to use formTools when you need to generate fields in your input form, for example massive of users / items.


## Example

### Clone pattern attributes description: 

- cp-init - the initialization area of the form or block;
- cp-options - list of options and rules;
- cp-viewport - the area where the cloned nodes will be added;
- cp-template - the cloned template;
- cp-inputs - area of input fields, in which data will be inserted;
- cp-add - the button for adding a cloned node;
- cp-rm - delete node button
- cp-counter - node counter


### Just follow this structure:

```html
<form cp-init="userList" cp-options="{minNode:1}">
	<span cp-add>Clone</span>
	<div cp-viewport>
		<div cp-template>
			<div cp-inputs>
	  			<label cp-counter>1</label>
	    			<input type="text" name="name[]">
	    			<input type="email" name="email[]">
	    			<span cp-rm></span>
			</div>
		</div>
	</div>
</form>
```

More examples and documentation you can see in my website http://artsemenishch.inf.ua/docs/projects/js/form-tools/


## Installation

### With composer 

`composer require artroot/form-tools`

### Regular Setup
To install formTools, just download the form-tools.min.js script and add into your head tag.

```html
<script src="path/to/form-tools.min.js"></script>
```

or use these links.

```html
<script src="http://artsemenishch.inf.ua/cdn/js/form-tools/form-tools.min.js"></script>
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
