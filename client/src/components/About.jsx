import {
    BriefcaseBusiness,
    Users,
    Building2,
} from "lucide-react";

const About = () => {
    return (
        <section
        id="about"
         className="bg-[#EFEFF0] px-5 py-20 sm:px-8 lg:px-12">

            <div className="mx-auto max-w-7xl">

                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                    {/* Left */}
                    <div>
                        <p className="text-sm font-semibold text-[#0A3ECA]">
                            About JobHub
                        </p>

                        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                            Making the right career connection simpler.
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-[#4B454F]">
                            JobHub connects talented job seekers with
                            companies looking for the right people. Find
                            opportunities, apply for jobs, and manage your
                            career journey from one place.
                        </p>
                    </div>

                    {/* Right */}
                    <div className="grid gap-4 sm:grid-cols-3">

                        <div className="rounded-2xl bg-white p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFEFF0]">
                                <BriefcaseBusiness
                                    size={19}
                                    className="text-[#0A3ECA]"
                                />
                            </div>

                            <h3 className="mt-5 font-bold">
                                Find Jobs
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-[#4B454F]">
                                Discover opportunities that match your
                                skills and goals.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFEFF0]">
                                <Users
                                    size={19}
                                    className="text-[#0A3ECA]"
                                />
                            </div>

                            <h3 className="mt-5 font-bold">
                                For Talent
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-[#4B454F]">
                                Build your profile and connect with
                                better opportunities.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFEFF0]">
                                <Building2
                                    size={19}
                                    className="text-[#0A3ECA]"
                                />
                            </div>

                            <h3 className="mt-5 font-bold">
                                For Recruiters
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-[#4B454F]">
                                Create jobs and discover qualified
                                candidates.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;