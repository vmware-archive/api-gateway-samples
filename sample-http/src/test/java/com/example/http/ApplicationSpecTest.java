package com.example.http;

import org.junit.Test;

public class ApplicationSpecTest extends com.pivotal.mss.apigateway.test.ApplicationSpecTest {

	public ApplicationSpecTest(String specName, String specFile) {
        super(specName, specFile);
    }

    @Test
    public void testSpecFiles() throws Exception {
        super.testSpecFiles();
    }
}
