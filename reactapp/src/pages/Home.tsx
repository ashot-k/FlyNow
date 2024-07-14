import React from "react";
import Search from "../components/search/Search";

interface HomePageProps {
    className?: string;
}

export default function Home({ className }: HomePageProps) {
    return (
        <div className={className}>
            <Search className={"flex w-full"} />
        </div>
    );
}
