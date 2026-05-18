



def function1():
    for i in range(n):
        pass


def function2():
    for i in range(n):
        for j in range(n):
            pass

# main function
if __name__ == "__main__":
    n = 1000
    # time the execution of function1 ms
    import time
    start_time = time.time()    
    function1()
    # function2()
    end_time = time.time()
    print("Execution time: ", (end_time - start_time) * 1000, "milliseconds")

