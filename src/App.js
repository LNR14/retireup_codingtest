

import React, { useState } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import data from './data.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data,
	});

	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map(headerGroup => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map(column => (
							<th {...column.getHeaderProps()}>{column.render('Header')}</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row, i) => {
					prepareRow(row)
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map(cell => {
								return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
							})}
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

function App() {
	const columns = React.useMemo(
		() => [
			{
				Header: 'S&P 500 Total Returns by Year',
				columns: [
					{
						Header: 'Year',
						accessor: 'year',
					},
					{
						Header: 'Total Return',
						accessor: 'totalReturn',
					},
				],
			}
		],
		[]
	);

	const [filteredData, setFilteredData] = useState(data);

	const [min, setMin] = useState(Math.min(...data.map(d => d.year)));
	const [max, setMax] = useState(Math.max(...data.map(d => d.year)));

	const onChangeSlider = (values) => {
		setFilteredData(data.filter(d => values[0] <= d.year && d.year <= values[1]));
	}
	
	return (
		<div style={{flex: 1, flexDirection: 'column'}}>
			<div style={{width: '50vw', height: 50, paddingTop:'5vh'}}>
				<div>
					<Range min={min} max={max} defaultValue={[min,max]} onChange={onChangeSlider} />
				</div>
			</div>
			<div style={{width: '100vw'}}>
				<Styles>
					<Table columns={columns} data={filteredData} />
				</Styles>
			</div>
		</div>
	)
}

export default App
