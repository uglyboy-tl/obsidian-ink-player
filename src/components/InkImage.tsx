import { memo } from "react";

interface InkImageProps {
	image_src?: string;
	className?: string;
}
const InkComponent: React.FC<InkImageProps> = ({
	image_src,
	className = "",
}) => {
	return <div id="ink-image">{image_src && <img src={image_src} />}</div>;
};

export default memo(InkComponent);
