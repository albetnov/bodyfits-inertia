import { Box, CardBody } from "@chakra-ui/react";
import Card from "../Card";
import Image from "../Image";
import UnderlineLink from "../UnderlineLink";
import WhiteText from "../WhiteText";

export default function Course({ item }) {
    return (
        <Card w={{ base: "fit-content", lg: 582 }} h={342}>
            <CardBody py={2} px={1}>
                <Image
                    src={item.photo}
                    query="fit=crop-top&crop=577,159&w=577&h=159"
                    rounded={40}
                    borderBottomRadius={0}
                    w={577}
                    h={159}
                />
                <Box position="relative" px={35} py={3}>
                    <WhiteText fontWeight="bold" fontSize={36}>
                        {item.title}
                    </WhiteText>
                    <WhiteText>
                        {item.description.length > 100
                            ? item.description.substring(0, 100) + "..."
                            : item.description}
                    </WhiteText>
                    <UnderlineLink
                        to="courses.detail"
                        params={{
                            courses: item.id,
                            lessons: item.lessons[0].id,
                        }}
                        fontWeight="bold"
                        fontSize={36}
                        position="absolute"
                        right={10}
                    >
                        Go
                    </UnderlineLink>
                </Box>
            </CardBody>
        </Card>
    );
}
