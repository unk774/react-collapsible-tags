# react-collapsible-tags
Simple react responsive tags component. Shows "more" tag when tags content overflow its container width.

Has wrappers for tags, "more", "+" modification.

Props:
```javascript
    tags?: string[]; //Tags string array. Also Children can be used for tags render 
    onAddTagClick?: () => void; //on "+" tag click
    onTagClick?: (tag: string) => void; //on tags click
    onMoreClick?: (moreCount: number) => void; //on "more ..." tag click
    addRender?: () => React.JSX.Element; //override "+" render
    moreRender?: (moreCount: number) => React.JSX.Element; //override "more" render
```

## Usage/Examples

```javascript
...
import CollapsibleTags from "react-collapsible-tags/lib/index"

function App() {
	const [tags, setTags] = useState(["some text 1...","some text 2...","some text 3..."])
    
	return <div style={{width: "300px"}}>
	  <CollapsibleTags tags={tags}
		  onAddTagClick={() => {
			  setTags(tags.concat(`some text ${tags.length + 1}...`))}
		  }/>
	  {/*custom tags*/}
	  <CollapsibleTags onAddTagClick={() => {
		  setTags(tags.concat(`some text ${tags.length + 1}...`))}
	  }>
		  {tags.map(tag => <div style={{border: "1px solid red", margin: "4px", borderRadius: "4px"}}>
			  {tag}
		  </div>)}
	  </CollapsibleTags>
  </div>
}
```

