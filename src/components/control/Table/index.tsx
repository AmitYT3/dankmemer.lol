import clsx from "clsx";
import { ReactNode } from "react";
import TableSortIcon from "./SortIcon";
import { TableInstance } from "@tanstack/react-table";

interface FilterableColumnData {
	id: number;
	type: "Sortable";
	name: string;
	content?: never;
	width: string;
	rtl?: boolean;
	hidden: boolean;
}

interface UnfilterableColumnData {
	id: number;
	type: "Unsortable";
	name?: never;
	content: ReactNode;
	width: string;
	rtl?: never;
	hidden: boolean;
}

export enum SortingState {
	ASCENDING = 0,
	DESCENDING = 1,
}

export type ColumnData = FilterableColumnData | UnfilterableColumnData;

interface Props {
	instance: TableInstance<any>;
}

export default function Table({ instance }: Props) {
	return (
		<div className="relative mt-4 w-full overflow-hidden text-neutral-600 dark:text-neutral-300">
			<div className="flex h-12 w-full select-none items-center rounded-lg bg-light-500 px-5 py-3 font-normal dark:bg-dark-100">
				{instance.getHeaderGroups().map((headerGroup) =>
					headerGroup.headers.map((header) => {
						const sortable = header.column.getCanSort();
						return (
							<div
								style={{
									width: header.getSize(),
								}}
								className={clsx(sortable && "cursor-pointer", header.column.id !== "select" && "grow")}
								onClick={() => header.column.toggleSorting()}
							>
								<div
									className={clsx(
										"flex grow items-center justify-start space-x-1",
										header.column.id.includes("rtl") && "float-right",
										sortable && "-mr-1"
									)}
								>
									<p>{header.renderHeader()}</p>
									{sortable && (
										<TableSortIcon
											active={header.column.getIsSorted() ? true : false}
											current={header.column.getIsSorted() as "asc" | "desc" | undefined}
										/>
									)}
								</div>
							</div>
						);
					})
				)}
			</div>
			<div className="mt-5 w-full text-sm">
				{instance.getRowModel().rows.map((row) => (
					<div
						key={row.id}
						className={clsx(
							"mb-2 flex h-12 w-full grow items-center justify-between rounded-lg px-5 hover:bg-neutral-100 dark:hover:bg-dark-100/50",
							row.getIsSelected() && "bg-neutral-100 dark:bg-dark-100/50"
						)}
					>
						{row.getVisibleCells().map((cell) => (
							<p
								key={cell.id}
								style={{ width: cell.column.getSize() }}
								className={clsx(
									cell.column.id.includes("rtl") && "text-right",
									cell.column.id !== "select" && "grow"
								)}
							>
								{cell.renderCell()}
							</p>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
