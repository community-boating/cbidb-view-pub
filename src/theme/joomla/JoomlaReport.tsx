import * as React from "react";

interface Props {
	headers: string[],
	rows: React.ReactNode[][]
}

export default (props: Props) => (
	<table cellPadding="0" cellSpacing="0" className="report-standard">
		<tbody><tr>
			{props.headers.zipWithIndex().map(headerTuple => (
				<th key={`header_${headerTuple[1]}`} align="center" id="NAME" className="header" style={({border: "none"})}>
					{headerTuple[0]}
				</th>
			))}
		</tr>
		{props.rows.zipWithIndex().map(rowTuple => {
			const isEven = rowTuple[1] % 2 == 0;
			return (
				<tr className="highlight-row" key={`row_${rowTuple[1]}`}>
					{rowTuple[0].zipWithIndex().map(cellTuple => (
						<td className="data" style={({background: isEven ? "#FAFAFA" : "$F0F0F0", padding: "10px"})} key={`cell_${cellTuple[1]}`}>
						{cellTuple[0]}
						</td>
					))}
				</tr>
			)
		})}
		</tbody>
	</table>
)
