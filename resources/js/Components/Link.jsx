import { Link as UILink } from "@chakra-ui/react";
import { Link as RouterLink } from "@inertiajs/inertia-react";

export default function Link({ to, params = null, ...props }) {
    return <UILink {...props} href={route(to, params)} as={RouterLink} />;
}
