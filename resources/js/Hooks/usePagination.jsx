import WhiteText from "@/Components/WhiteText";
import { COLORS } from "@/Utils/colors";
import { Button, Flex } from "@chakra-ui/react";
import { useState, useEffect, useReducer } from "react";
import { FiArrowDown } from "react-icons/fi";

const listsReducer = (state, action) => {
    switch (action.type) {
        case "setData":
            if (state.replace) {
                return {
                    data: action.payload,
                    firstFetch: state.firstFetch,
                    replace: true,
                };
            }
            if (state.firstFetch) {
                return {
                    data: action.payload,
                    firstFetch: false,
                    replace: state.replace,
                };
            }
            return {
                data: [...state.data, ...action.payload],
                firstFetch: state.firstFetch,
                replace: state.replace,
            };
        default:
            return { data: state.data, firstFetch: state.firstFetch };
    }
};

export default function usePagination(
    item,
    config = {
        initialNotSame: true,
        replace: false,
        perPage: 15,
        startPage: 0,
    }
) {
    const [hasNext, setHasNext] = useState(true);
    const [lists, dispatchLists] = useReducer(listsReducer, {
        data: item.data,
        firstFetch: config.initialNotSame,
        replace: config.replace,
    });
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(false);
    const [current, setCurrent] = useState(config.startPage);

    useEffect(() => {
        setLimit(item.last_page);
    }, []);

    const next = async () => {
        setLoading(true);
        const res = await fetch(
            `${item.path}?page=${current + 1}&per_page=${config.perPage}`,
            {
                headers: {
                    Accept: "applicaton/json",
                },
            }
        );
        const json = await res.json();
        setCurrent(json.current_page);
        setLimit(json.last_page);
        setLoading(false);
        dispatchLists({ type: "setData", payload: json.data });
    };

    const previous = async () => {
        setLoading(true);
        const res = await fetch(
            `${item.path}?page=${current - 1}&per_page=${config.perPage}`,
            {
                headers: {
                    Accept: "applicaton/json",
                },
            }
        );
        const json = await res.json();
        setCurrent(json.current_page);
        setLimit(json.last_page);
        setLoading(false);
        dispatchLists({ type: "setData", payload: json.data });
    };

    useEffect(() => {
        console.log(current, limit);
        if (limit !== false && current === limit) {
            setHasNext(false);
        } else {
            setHasNext(true);
        }
    }, [item, lists]);

    const element = hasNext && (
        <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mb={81}
        >
            <Button
                bg={COLORS.itemSoft}
                minH="fit-content"
                maxW="fit-content"
                rounded="full"
                color={COLORS.putih}
                fontSize={30}
                py={8}
                onClick={next}
                isLoading={loading}
            >
                <FiArrowDown />
            </Button>
            <WhiteText textDecoration="underline">Show More</WhiteText>
        </Flex>
    );

    return {
        hasNext,
        next,
        loading,
        lists: lists.data,
        element,
        previous,
        hasPrevious: current > config.startPage,
    };
}
