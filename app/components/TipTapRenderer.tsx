'use client'

import React from 'react'

interface TipTapRendererProps {
    content: any
    className?: string
}

export default function TipTapRenderer({ content, className = '' }: TipTapRendererProps) {
    if (!content) return null

    let parsedContent = content
    if (typeof content === 'string') {
        try {
            parsedContent = JSON.parse(content)
        } catch (error) {
            return null
        }
    }

    const renderNode = (node: any, index: number | string): React.ReactNode => {
        if (!node.type) return null

        const textAlignClass = node.attrs?.textAlign ? `text-${node.attrs.textAlign}` : ''

        switch (node.type) {
            case 'paragraph':
                return (
                    <p key={index} className={`mb-4 leading-relaxed text-gray-700 ${textAlignClass}`}>
                        {node.content?.map((child: any, i: number) => renderNode(child, `${index}-${i}`))}
                    </p>
                )

            case 'heading':
                const level = node.attrs?.level || 2
                const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
                const headingClasses: { [key: number]: string } = {
                    1: 'text-4xl font-bold mb-6 mt-8 text-gray-900',
                    2: 'text-3xl font-bold mb-5 mt-7 text-gray-900',
                    3: 'text-2xl font-bold mb-4 mt-6 text-gray-900',
                    4: 'text-xl font-bold mb-3 mt-5 text-gray-900',
                    5: 'text-lg font-bold mb-2 mt-4 text-gray-900',
                    6: 'text-base font-bold mb-2 mt-3 text-gray-900',
                }
                return (
                    <HeadingTag key={index} className={`${headingClasses[level]} ${textAlignClass}`}>
                        {node.content?.map((child: any, i: number) => renderNode(child, `${index}-${i}`))}
                    </HeadingTag>
                )

            case 'bulletList':
                return (
                    <ul key={index} className="list-disc list-outside mb-4 space-y-2 ml-5">
                        {node.content?.map((child: any, i: number) => renderNode(child, `${index}-${i}`))}
                    </ul>
                )

            case 'orderedList':
                return (
                    <ol key={index} className="list-decimal list-outside mb-4 space-y-2 ml-5">
                        {node.content?.map((child: any, i: number) => renderNode(child, `${index}-${i}`))}
                    </ol>
                )

            case 'listItem':
                return (
                    <li key={index} className="text-gray-700 pl-1">
                        {node.content?.map((child: any, i: number) => {
                            if (child.type === 'paragraph') {
                                return (
                                    <span key={`${index}-${i}`} className="block mb-1">
                                        {child.content?.map((c: any, j: number) => renderNode(c, `${index}-${i}-${j}`))}
                                    </span>
                                )
                            }
                            return renderNode(child, `${index}-${i}`)
                        })}
                    </li>
                )

            case 'blockquote':
                return (
                    <blockquote key={index} className={`border-l-4 border-orange-500 pl-4 py-2 mb-4 italic text-gray-600 bg-orange-50/50 rounded-r-lg ${textAlignClass}`}>
                        {node.content?.map((child: any, i: number) => renderNode(child, `${index}-${i}`))}
                    </blockquote>
                )

            case 'codeBlock':
                return (
                    <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
                        <code>{node.content?.map((child: any) => child.text).join('')}</code>
                    </pre>
                )

            case 'horizontalRule':
                return <hr key={index} className="my-8 border-gray-200" />

            case 'hardBreak':
                return <br key={index} />

            case 'image':
                return (
                    <img
                        key={index}
                        src={node.attrs?.src}
                        alt={node.attrs?.alt || ''}
                        title={node.attrs?.title || ''}
                        className="max-w-full h-auto rounded-xl my-6 shadow-md border border-gray-100"
                    />
                )

            case 'text':
                let textNode: React.ReactNode = node.text

                if (node.marks) {
                    node.marks.forEach((mark: any) => {
                        switch (mark.type) {
                            case 'bold':
                                textNode = <strong>{textNode}</strong>
                                break
                            case 'italic':
                                textNode = <em>{textNode}</em>
                                break
                            case 'code':
                                textNode = <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-orange-600">{textNode}</code>
                                break
                            case 'strike':
                                textNode = <del>{textNode}</del>
                                break
                            case 'underline':
                                textNode = <u>{textNode}</u>
                                break
                            case 'link':
                                textNode = (
                                    <a
                                        href={mark.attrs?.href}
                                        target={mark.attrs?.target || '_blank'}
                                        rel="noopener noreferrer"
                                        className="text-orange-500 hover:text-orange-600 underline underline-offset-2 transition-colors"
                                    >
                                        {textNode}
                                    </a>
                                )
                                break
                        }
                    })
                }

                return <React.Fragment key={index}>{textNode}</React.Fragment>

            default:
                return null
        }
    }

    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            {parsedContent.content?.map((node: any, index: number) => renderNode(node, index))}
        </div>
    )
}