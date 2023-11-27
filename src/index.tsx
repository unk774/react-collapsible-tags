import * as React from "react"
import {Children, PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import useResizeObserver from '@react-hook/resize-observer'
import "./styles/CollapsibleTags.css"

export interface CollapsibleTagsProps {
	tags?: string[],
	onAddTagClick?: () => void,
	onTagClick?: (tag:string) => void,
	onMoreClick?: (moreCount: number) => void,
	addRender?: () => JSX.Element;
	moreRender?: (moreCount: number) => JSX.Element;
}

export default function CollapsibleTags(props: PropsWithChildren<CollapsibleTagsProps>) {
	const {tags, children,
		addRender, moreRender,
		onTagClick, onAddTagClick, onMoreClick} = props;

	const ref = useRef<HTMLDivElement>(null);

	const tagsCount = Children.count(children)
		? Children.count(children)
		: tags?.length
			? tags?.length
			: 0;

	const [visibleElements, setVisibleElements] = useState(tagsCount);
	const [tagsSizes, setTagsSizes] = useState([] as number[]);
	const [controlElementsSize, setControlElementsSize] = useState([] as number[]);
	const [moreVisible, setMoreVisible] = useState(true)

	useEffect(() => {
		let childSizes:number[] = []
		if (ref.current) {
			for (let i = 0; i < ref.current.childNodes.length; i++) {
				const element = ref.current.childNodes[i] as HTMLStyleElement
				childSizes.push(element.offsetWidth)
			}
		}
		setTagsSizes(childSizes.slice(0,-2))
		setControlElementsSize(childSizes.slice(-2))
	}, [children, tags])

	useEffect(() => resize(), [tagsSizes])

	const resize = useCallback(() => {
		if (ref.current) {
			const containerWidth = ref.current.offsetWidth;
			const moreSize = controlElementsSize[0]
			const addSize = controlElementsSize[1]
			let visibleElementsCount = 0;
			let elementsWidth = 0;

			if ((tagsSizes.reduce((a,b) => a+b, 0) + addSize) <= containerWidth) {
				setVisibleElements(tagsSizes.length)
				setMoreVisible(false)
				return;
			}

			while (visibleElementsCount < tagsCount) {
				elementsWidth += tagsSizes[visibleElementsCount]
				if (elementsWidth > (containerWidth - addSize - (moreVisible ? moreSize : 0))) {
					break;
				}
				visibleElementsCount++
			}

			setVisibleElements(visibleElementsCount)
			setMoreVisible(visibleElementsCount !== tagsCount)
		}
	}, [ref, controlElementsSize, tagsSizes, moreVisible])

	useResizeObserver(ref, resize)

	const renderTags = useCallback(() => {
		const components = children
			? Children.toArray(children)
			: tags
				? tags.map(tag => <span className={"collapsible-tags__tag"} onClick={() => onTagClick && onTagClick(tag)}>
					{tag}
				</span>)
				: []
		return components.map((c,index) => <div
			key={`collapsible-tags__tag-wrapper__${index}`}
			className={`collapsible-tags__tag-wrapper${index > (visibleElements - 1) ? " collapsible-tags__tag-wrapper--hidden": ""}`}>
			{c}
		</div>)
	}, [tags, children, visibleElements, onTagClick])

	const renderMore = useCallback(() => {
		const moreCount = tagsCount - visibleElements;
		const component = moreRender
			? moreRender(moreCount)
			: <span className={"collapsible-tags__more"} onClick={() => onMoreClick && onMoreClick(tagsCount)}>
			{`${moreCount} more`}
		</span>
		return <div key={"collapsible-tags__more-wrapper"}
					className={`collapsible-tags__more-wrapper${!moreVisible ? " collapsible-tags__more-wrapper--hidden" : ""}`}>
			{component}
		</div>
	}, [tagsCount, visibleElements, moreVisible, onMoreClick])

	const renderAdd = useCallback(() => {
		const component = addRender
			? addRender()
			: <span onClick={onAddTagClick}
					className={"collapsible-tags__add"}
			>+</span>
		return <div key={"collapsible-tags__tag-wrapper"}
					className={"collapsible-tags__tag-wrapper"}>
			{component}
		</div>
	}, [onAddTagClick])

	return (
		<div ref={ref} className={"collapsible-tags"}>
			{renderTags()}
			{renderMore()}
			{renderAdd()}
		</div>
	)
}