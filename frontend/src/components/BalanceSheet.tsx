import clsx from "clsx";
import { BalanceSheetReport } from "../api/balance-sheets/balance-sheets.model";

interface BalanceSheetProps {
	balanceSheet: BalanceSheetReport;
}

export const BalanceSheet = ({ balanceSheet }: BalanceSheetProps) => {
	return (
		<table className="min-w-full divide-y divide-gray-300">
			<tbody className="divide-y divide-gray-200">
				{balanceSheet?.Rows.map((row, index) => {
					switch (row.RowType) {
						case "Header":
							return (
								<tr key={index} className="divide-x divide-gray-200">
									{row.Cells.map((cell, cellIndex) => (
										<td
											key={`cell-${index}-${cellIndex}`}
											className="whitespace-nowrap px-3 py-4 text-base font-medium text-gray-900"
										>
											{cell.Value}
										</td>
									))}
								</tr>
							);
						case "Section":
							return row.Title ? (
								<tr key={index} className="divide-x divide-gray-200">
									<td className="whitespace-nowrap px-3 py-4 text-base font-semibold text-gray-900">
										{row.Title}
									</td>
								</tr>
							) : (
								<></>
							);

						case "Row":
							return (
								<tr key={index} className="divide-x divide-gray-200">
									{row.Cells.map((cell, cellIndex) => (
										<td
											key={`cell-${index}-${cellIndex}`}
											className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
										>
											{cell.Value}
										</td>
									))}
								</tr>
							);

						case "SummaryRow":
							// First cell of the summary row should have text aligned right
							return (
								<tr key={index} className="divide-x divide-gray-200">
									{row.Cells.map((cell, cellIndex) => (
										<td
											key={`cell-${index}-${cellIndex}`}
											className={clsx(
												"whitespace-nowrap px-3 py-4 text-sm text-gray-500",
												{ "text-right font-semibold": cellIndex === 0 },
											)}
										>
											{cell.Value}
										</td>
									))}
								</tr>
							);
					}
				})}
			</tbody>
		</table>
	);
};
