import { useEffect, useRef, useState } from "react";
import Input from "src/components/store/Input";
import { Title } from "src/components/Title";
import { Icon as Iconify } from "@iconify/react";
import clsx from "clsx";
import axios from "axios";
import Button from "src/components/ui/Button";

interface Props {
	id: string;
	name: string;
	image: string;
	description: string;
}

export default function ProductEditor({ id, name, image, description }: Props) {
	const imageUploadInput = useRef<any>();

	const [noDbContent, setNoDbContent] = useState(false);
	const [canSubmit, setCanSubmit] = useState(false);

	const [productId, setProductId] = useState(id);
	const [productName, setProductName] = useState(name);
	const [productImage, setProductImage] = useState<File>();
	const [productImageUrl, setProductImageUrl] = useState(image);
	const [productDescription, setProductDescription] = useState(description);

	const [primaryTitle, setPrimaryTitle] = useState("");
	const [primaryBody, setPrimaryBody] = useState("");

	const [secondaryCollapsed, setSecondaryCollapsed] = useState(false);
	const [secondaryEnabled, setSecondaryEnabled] = useState(false);
	const [confirmDeleteSecondary, setConfirmDeleteSecondary] = useState(false);

	const [secondaryTitle, setSecondaryTitle] = useState("");
	const [secondaryBody, setSecondaryBody] = useState("");

	useEffect(() => {
		axios(`/api/store/product/details?id=${id}`)
			.then(({ data }) => {
				setProductName(name);
				setPrimaryTitle(data.primaryTitle);
				setPrimaryBody(data.primaryBody);

				if (data.secondaryTitle || data.secondaryBody) {
					setSecondaryEnabled(true);
					setSecondaryTitle(data.secondaryTitle);
					setSecondaryBody(data.secondaryBody);
				}
			})
			.catch((e) => {
				setNoDbContent(true);
			});

		return () => {
			setProductId("");
			setProductName("");
		};
	}, []);

	// TODO: Check for image and description
	useEffect(() => {
		if (
			productName.length >= 1 &&
			productName.length <= 250 &&
			productDescription.length <= 250 &&
			productImageUrl.length >= 1 &&
			primaryTitle.length >= 1 &&
			primaryBody.length >= 1 &&
			(secondaryEnabled
				? secondaryTitle.length >= 1 && secondaryBody.length >= 1
				: true)
		) {
			setCanSubmit(true);
		} else {
			setCanSubmit(false);
		}
	}, [
		productName,
		productImage,
		productDescription,
		primaryTitle,
		primaryBody,
		secondaryEnabled,
		secondaryTitle,
		secondaryBody,
	]);

	const removeSecondary = () => {
		if (
			!confirmDeleteSecondary &&
			(secondaryTitle.length >= 1 || secondaryBody.length >= 1)
		) {
			setConfirmDeleteSecondary(true);
		} else {
			setConfirmDeleteSecondary(false);
			setSecondaryEnabled(false);
			setSecondaryTitle("");
			setSecondaryBody("");
		}
	};

	const submitChanges = () => {
		if (canSubmit) {
			axios({
				url: "/api/store/product/update?productId=" + id,
				method: "PUT",
				data: {
					name: productName,
					description: productDescription,
					primaryTitle,
					primaryBody,
					secondaryTitle,
					secondaryBody,
				},
			});
		}
	};

	return (
		<>
			{noDbContent && (
				<div className="mb-5 rounded-lg bg-red-500 py-2 px-10 text-center shadow shadow-red-500">
					There currently isn't any store information stored for this
					product. Add some now for content to be shown in the product
					body on the store page.
				</div>
			)}
			<Title size="big">Edit product</Title>
			<p className="text-neutral-600 dark:text-neutral-400">
				Edit both website data and Stripe data for '{name}'
			</p>
			<div className="mt-4 space-y-5">
				<div className="w-full space-y-3">
					<Input
						width="w-full"
						type={"text"}
						placeholder={"Dank Memer 2"}
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
						label={
							<>
								Product name
								<sup className="text-red-500">*</sup>
							</>
						}
					/>
					<div className="">
						<label className="mb-1 text-neutral-600 dark:text-neutral-300">
							Product description
						</label>
						<textarea
							value={productDescription}
							onChange={(e) =>
								setProductDescription(e.target.value)
							}
							placeholder={
								"This is purely for Stripe and will not be shown on the store page. It may appear on invoices."
							}
							className="h-20 w-full resize-none rounded-md border-[1px] border-neutral-300 px-3 py-2 font-inter text-sm focus-visible:border-dank-300 focus-visible:outline-none dark:border-neutral-700 dark:bg-black/30"
						/>
					</div>
				</div>
				<Input
					width="w-full"
					type={"text"}
					placeholder={"Exclusive benefits"}
					defaultValue={"Exclusive benefits"}
					value={primaryTitle}
					onChange={(e) => setPrimaryTitle(e.target.value)}
					label={
						<>
							Primary body title
							<sup className="text-red-500">*</sup>
						</>
					}
				/>
				<div className="">
					<label className="mb-1 text-neutral-600 dark:text-neutral-300">
						Content for '
						{primaryTitle.length >= 1
							? primaryTitle
							: "Exclusive benefits"}
						'<sup className="text-red-500">*</sup>
					</label>
					<textarea
						value={primaryBody}
						onChange={(e) => setPrimaryBody(e.target.value)}
						placeholder={
							"What is so special about this product? Markdown is supported in this field."
						}
						className="min-h-[38px] w-full resize-y rounded-md border-[1px] border-neutral-300 px-3 py-2 font-inter text-sm focus-visible:border-dank-300 focus-visible:outline-none dark:border-neutral-700 dark:bg-black/30"
					/>
				</div>
				{!secondaryEnabled && (
					<div className="grid cursor-pointer select-none place-items-center">
						<button
							onClick={() => setSecondaryEnabled(true)}
							className="flex w-full max-w-xs items-center justify-center space-x-2 rounded-lg bg-neutral-200 py-2 text-neutral-500 transition-colors hover:bg-dank-300 hover:text-white dark:bg-dank-400 dark:text-neutral-400 hover:dark:bg-dank-300 hover:dark:text-white"
						>
							<Iconify icon="bx:plus" height={20} />
							<p>Add secondary details</p>
						</button>
					</div>
				)}
				{secondaryEnabled && (
					<div
						className={clsx(
							!secondaryCollapsed && "space-y-4 ",
							"h-max w-full rounded-lg bg-neutral-200/80 py-5 px-4 dark:bg-dank-500"
						)}
					>
						<div
							className="group flex cursor-pointer items-center"
							onClick={() =>
								setSecondaryCollapsed((curr) => !curr)
							}
						>
							<div className="order-1 h-[2px] flex-none grow bg-[#c0c0c0] dark:bg-neutral-500 group-hover:dark:bg-white"></div>
							<p className="order-2 mx-3 select-none text-neutral-500 dark:text-neutral-400 group-hover:dark:text-white">
								{secondaryCollapsed ? "Expand" : "Collapse"}
							</p>
							<div className="order-3 h-[2px] flex-none grow bg-[#c0c0c0] dark:bg-neutral-500"></div>
						</div>
						<div
							className={clsx(
								secondaryCollapsed ? "h-0" : "h-max ",
								"space-y-4 overflow-hidden"
							)}
						>
							<div className="">
								<Title size="xsmall">
									Secondary product information
								</Title>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									These fields are not required, this is would
									most commonly be used for subscription
									products with included benefits of previous
									tiers.
								</p>
							</div>
							<Input
								width="w-full"
								type={"text"}
								placeholder={"Also included"}
								defaultValue={"Also included"}
								value={secondaryTitle}
								onChange={(e) =>
									setSecondaryTitle(e.target.value)
								}
								label={"Secondary body title"}
							/>
							<div className="">
								<label className="mb-1 text-neutral-600 dark:text-neutral-300">
									Content for '
									{secondaryTitle.length >= 1
										? secondaryTitle
										: "Also included"}
									'
								</label>
								<textarea
									value={secondaryBody}
									onChange={(e) =>
										setSecondaryBody(e.target.value)
									}
									placeholder={
										"What else is so interesting about this product? Markdown is supported in this field."
									}
									className="min-h-[38px] w-full resize-y rounded-md border-[1px] border-neutral-300 px-3 py-2 font-inter text-sm focus-visible:border-dank-300 focus-visible:outline-none dark:border-neutral-700 dark:bg-black/30"
								/>
							</div>
							<div className="grid cursor-pointer select-none place-items-center">
								<button
									onClick={() => removeSecondary()}
									className="flex w-full max-w-xs items-center justify-center space-x-2 rounded-lg py-2 transition-colors dark:bg-black/30 dark:text-neutral-400 hover:dark:bg-red-500 hover:dark:text-white"
								>
									<Iconify icon="bx:minus" height={20} />
									<p>
										{confirmDeleteSecondary
											? "Confirm removal"
											: "Remove section"}
									</p>
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
			{/* <div className="space-y-5 py-5">
				<div>
					<Title size="medium">Stripe data</Title>
					<p className="text-neutral-600 dark:text-neutral-400">
						Stripe/backend specific data. This is unlikely to be
						seen by users.
					</p>
				</div>
			</div> */}
			<div className="sticky left-0 -bottom-0 w-full bg-neutral-100 py-10 dark:bg-dark-100">
				<Button
					size="medium-large"
					variant={canSubmit ? "primary" : "dark"}
					className={clsx(
						!canSubmit && "cursor-not-allowed",
						"w-full"
					)}
					onClick={submitChanges}
				>
					Submit changes
				</Button>
			</div>
		</>
	);
}
